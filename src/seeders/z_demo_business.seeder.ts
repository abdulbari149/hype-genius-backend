import { plainToInstance } from 'class-transformer';
import { hash } from 'bcryptjs';
import { DataSource, In } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import UserEntity from '../app/users/entities/user.entity';
import { RoleEntity } from '../app/roles/entities/role.entity';
import ROLES from '../constants/roles';
import BusinessEntity from '../app/business/entities/business.entity';
import ChannelEntity from '../app/channels/entities/channels.entity';
import BusinessChannelEntity from '../app/business/entities/business.channel.entity';
import ContractEntity from '../app/contract/entities/contract.entity';
import CurrencyEntity from '../app/currency/entities/currency.entity';
import TagsEntity from '../app/tags/entities/tags.entity';
import { AlertsEntity } from '../app/alerts/entities/alerts.entity';
import { BusinessChannelAlertsEntity } from '../app/alerts/entities/business_channel_alerts.entity';
import PaymentsEntity from '../app/payments/entities/payments.entity';
import VideosEntity from '../app/videos/entities/videos.entity';
import { NotesEntity } from '../app/notes/entities/notes.entity';
import { BusinessChannelNotesEntity } from '../app/notes/entities/business_channel_notes.entity';
import { VideoNotesEntity } from '../app/notes/entities/video_notes.entity';
import BusinessChannelAlertVideoEntity from '../app/videos/entities/business_channel_video_alert.entity';
import FollowUpEntity from '../app/business/entities/follow.up.entity';
import OnboardRequestsEntity from '../app/channels/entities/onboard_requests.entity';
import { UploadFrequencies } from '../constants/upload_frequencies';
import { Alerts } from '../constants/alerts';
import { SendTo } from '../app/business/dto/create-followup.dto';

const DEMO_ADMIN_EMAIL = 'demo-admin@hypegenius.local';
const DEMO_PASSWORD = 'Demo123!';
const INFLUENCER_COUNT = 30;
const TAG_COLORS = ['#697AFF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#C77DFF'];

export class DemoBusinessSeeder implements Seeder {
  async run(_factory: Factory, dataSource: DataSource): Promise<void> {
    const qr = dataSource.createQueryRunner();
    await qr.connect();

    const existing = await qr.manager.findOne(UserEntity, {
      where: { email: DEMO_ADMIN_EMAIL },
    });
    if (existing) {
      console.log(
        '[DemoBusinessSeeder] Skipping: demo admin already exists. Delete demo user or DB to re-seed.',
      );
      await qr.release();
      return;
    }

    try {
      await qr.startTransaction();

      const roles = await qr.manager.find(RoleEntity, {
        where: { role: In([ROLES.BUSINESS_ADMIN, ROLES.INFLUENCER]) },
      });
      const roleByName = new Map(roles.map((r) => [r.role, r.id]));
      const businessAdminRoleId = roleByName.get(ROLES.BUSINESS_ADMIN);
      const influencerRoleId = roleByName.get(ROLES.INFLUENCER);
      if (!businessAdminRoleId || !influencerRoleId) {
        throw new Error(
          '[DemoBusinessSeeder] Missing roles: run roles_and_routes seeder first.',
        );
      }

      const currencies = await qr.manager.find(CurrencyEntity);
      if (currencies.length === 0) {
        throw new Error(
          '[DemoBusinessSeeder] No currencies: run currency seeder first.',
        );
      }
      const usd =
        currencies.find((c) => c.name.toLowerCase() === 'usd') ?? currencies[0];
      const gbp =
        currencies.find((c) => c.name.toLowerCase() === 'gbp') ?? currencies[0];

      const alertRows = await qr.manager.find(AlertsEntity);
      const alertByName = new Map(alertRows.map((a) => [a.name, a]));
      const alertIds = [
        Alerts.MISSING_DEAL,
        Alerts.PAYMENT_DUE,
        Alerts.NEW_VIDEO,
        Alerts.FOLLOW_UP,
        Alerts.UPLOAD_FREQ,
      ]
        .map((n) => alertByName.get(n))
        .filter((a): a is AlertsEntity => !!a);
      if (alertIds.length === 0) {
        throw new Error(
          '[DemoBusinessSeeder] No alerts: run alerts seeder first.',
        );
      }

      const hashed = await hash(DEMO_PASSWORD, 10);

      const admin = await qr.manager.save(
        plainToInstance(UserEntity, {
          firstName: 'Demo',
          lastName: 'Admin',
          email: DEMO_ADMIN_EMAIL,
          password: hashed,
          phoneNumber: '+155501000001',
          roleId: businessAdminRoleId,
        }),
      );

      const business = await qr.manager.save(
        plainToInstance(BusinessEntity, {
          name: 'Demo Coffee Co.',
          link: 'https://democoffee.example.com',
          admin_id: admin.id,
          onboardingLink: 'https://app.hypegenius.example/onboard/demo',
          default_currency_id: usd.id,
          customer_ltv: 125000,
          acrvv: 42.5,
        }),
      );

      const frequencies = Object.values(UploadFrequencies);
      const businessChannels: BusinessChannelEntity[] = [];
      const bcaByBusinessChannelId = new Map<number, BusinessChannelAlertsEntity>();

      for (let i = 0; i < INFLUENCER_COUNT; i++) {
        const inf = await qr.manager.save(
          plainToInstance(UserEntity, {
            firstName: `Influencer`,
            lastName: `${i + 1}`,
            email: `demo-influencer-${i + 1}@hypegenius.local`,
            password: hashed,
            phoneNumber: `+1555001${String(i + 1).padStart(4, '0')}`,
            roleId: influencerRoleId,
          }),
        );
        const channel = await qr.manager.save(
          plainToInstance(ChannelEntity, {
            name: `Demo Channel ${i + 1}`,
            link: `https://youtube.com/@democreator${i + 1}`,
            influencer_id: inf.id,
          }),
        );

        const bc = await qr.manager.save(
          plainToInstance(BusinessChannelEntity, {
            businessId: business.id,
            channelId: channel.id,
            userId: inf.id,
          }),
        );
        businessChannels.push(bc);

        await qr.manager.save(
          plainToInstance(ContractEntity, {
            is_one_time: i % 5 === 0,
            upload_frequency: frequencies[i % frequencies.length],
            amount: 500 + i * 25,
            currency_id: usd.id,
            budget: 5000 + i * 100,
            business_channel_id: bc.id,
          }),
        );

        const alertEntity = alertIds[i % alertIds.length];
        const bca = await qr.manager.save(
          plainToInstance(BusinessChannelAlertsEntity, {
            alert_id: alertEntity.id,
            business_channel_id: bc.id,
          }),
        );
        bcaByBusinessChannelId.set(bc.id, bca);
      }

      let tagIndex = 0;
      for (let i = 0; i < INFLUENCER_COUNT; i++) {
        const bc = businessChannels[i];
        const tagsPerRow = i < 10 ? 2 : 1;
        for (let t = 0; t < tagsPerRow; t++) {
          await qr.manager.save(
            plainToInstance(TagsEntity, {
              text: `Tag ${tagIndex + 1}`,
              color: TAG_COLORS[tagIndex % TAG_COLORS.length],
              active: true,
              business_channel_id: bc.id,
            }),
          );
          tagIndex++;
        }
      }

      const paymentsByBc = new Map<number, PaymentsEntity[]>();
      for (let i = 0; i < INFLUENCER_COUNT; i++) {
        const bc = businessChannels[i];
        const p = await qr.manager.save(
          plainToInstance(PaymentsEntity, {
            business_amount: BigInt(10000 + i * 100),
            channel_amount: BigInt(8000 + i * 80),
            channel_currency_id: usd.id,
            business_currency_id: usd.id,
            business_channel_id: bc.id,
          }),
        );
        paymentsByBc.set(bc.id, [p]);
      }
      for (let i = 0; i < 8; i++) {
        const bc = businessChannels[i];
        const p = await qr.manager.save(
          plainToInstance(PaymentsEntity, {
            business_amount: BigInt(5000 + i * 50),
            channel_amount: BigInt(4000 + i * 40),
            channel_currency_id: gbp.id,
            business_currency_id: usd.id,
            business_channel_id: bc.id,
          }),
        );
        paymentsByBc.get(bc.id)!.push(p);
      }

      const videos: VideosEntity[] = [];
      for (let v = 0; v < 40; v++) {
        const bcIdx = v % INFLUENCER_COUNT;
        const bc = businessChannels[bcIdx];
        const pays = paymentsByBc.get(bc.id) ?? [];
        const pay = pays[v % pays.length];
        const withPayment = v < 35;
        const vid = await qr.manager.save(
          plainToInstance(VideosEntity, {
            title: `Demo Video ${v + 1}`,
            link: `https://youtube.com/watch?v=${10000 + v}`,
            views: 1000 + v * 137,
            is_payment_due: v % 7 === 0,
            payment_id: withPayment && pay ? pay.id : undefined,
            business_channel_id: bc.id,
          }),
        );
        videos.push(vid);
      }

      const notesBodies: NotesEntity[] = [];
      for (let n = 0; n < 80; n++) {
        notesBodies.push(
          await qr.manager.save(
            plainToInstance(NotesEntity, {
              body: `Demo note ${n + 1}: follow up on campaign progress and deliverables.`,
            }),
          ),
        );
      }

      for (let n = 0; n < 40; n++) {
        await qr.manager.save(
          plainToInstance(BusinessChannelNotesEntity, {
            business_channel_id: businessChannels[n % INFLUENCER_COUNT].id,
            note_id: notesBodies[n].id,
            pinned: n % 4 === 0,
          }),
        );
      }
      for (let n = 0; n < 40; n++) {
        await qr.manager.save(
          plainToInstance(VideoNotesEntity, {
            note_id: notesBodies[40 + n].id,
            video_id: videos[n].id,
          }),
        );
      }

      for (let n = 0; n < 35; n++) {
        const v = videos[n];
        const bca = bcaByBusinessChannelId.get(v.business_channel_id);
        if (!bca) continue;
        await qr.manager.save(
          plainToInstance(BusinessChannelAlertVideoEntity, {
            business_channel_alert_id: bca.id,
            video_id: v.id,
          }),
        );
      }

      const followDates = [
        '2026-05-01',
        '2026-05-08',
        '2026-05-15',
        '2026-06-01',
        '2026-06-10',
      ];
      for (let n = 0; n < 40; n++) {
        const bc = businessChannels[n % INFLUENCER_COUNT];
        const bca = bcaByBusinessChannelId.get(bc.id);
        await qr.manager.save(
          plainToInstance(FollowUpEntity, {
            business_channel_id: bc.id,
            business_channel_alert_id: n % 3 === 0 ? bca?.id : undefined,
            send_to: n % 2 === 0 ? SendTo.EMAIL : SendTo.PHONE,
            schedule_at: followDates[n % followDates.length],
          }),
        );
      }

      for (let n = 0; n < 35; n++) {
        await qr.manager.save(
          plainToInstance(OnboardRequestsEntity, {
            business_id: business.id,
            link: `https://app.hypegenius.example/r/seed-${10000 + n}`,
            data: {
              contract: {
                amount: 400 + n * 10,
                is_one_time: n % 2 === 0,
                currency_id: usd.id,
                upload_frequency: frequencies[n % frequencies.length],
                budget: 3000 + n * 50,
                note: `Onboarding draft ${n + 1}`,
              },
              tags: [
                {
                  text: `Onboard tag ${n + 1}a`,
                  color: TAG_COLORS[n % TAG_COLORS.length],
                  active: true,
                },
                {
                  text: `Onboard tag ${n + 1}b`,
                  color: TAG_COLORS[(n + 1) % TAG_COLORS.length],
                  active: n % 3 !== 0,
                },
              ],
            },
          }),
        );
      }

      await qr.commitTransaction();
      console.log(
        `[DemoBusinessSeeder] Done. Admin login: ${DEMO_ADMIN_EMAIL} / ${DEMO_PASSWORD}`,
      );
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }
}