import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1681833853026 implements MigrationInterface {
  name = 'initial1681833853026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "business_channel_notes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "business_channel_id" integer NOT NULL, "note_id" integer NOT NULL, "pinned" boolean DEFAULT false, CONSTRAINT "PK_7233fc462ee89eef420a90da19f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "body" text NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "video_notes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "note_id" integer NOT NULL, "video_id" integer NOT NULL, CONSTRAINT "PK_e7f6f708f201616cf3dc6dde515" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_channel_alert_video" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "business_channel_alert_id" integer NOT NULL, "video_id" integer NOT NULL, "business_channel_id" integer, CONSTRAINT "PK_0319c458c49e90e6dcdb26c6cd6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "videos" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "title" character varying NOT NULL, "link" character varying NOT NULL, "views" integer NOT NULL, "is_payment_due" boolean NOT NULL, "payment_id" integer, "business_channel_id" integer NOT NULL, CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "business_amount" bigint NOT NULL, "channel_amount" bigint NOT NULL, "channel_currency_id" integer NOT NULL, "business_currency_id" integer NOT NULL, "business_channel_id" integer NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channels" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "name" character varying(255) NOT NULL, "link" character varying NOT NULL, "influencer_id" integer NOT NULL, CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "routes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "request_type" character varying NOT NULL, "end_point" character varying NOT NULL, CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "route_permissions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "route_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_f4ebaa8b53a13bdf4da12a1b742" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "role" character varying(255) NOT NULL, CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboard_requests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "link" character varying NOT NULL, "business_id" integer NOT NULL, "data" jsonb NOT NULL, CONSTRAINT "PK_cebd106eff5f8dbfad81304571f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "business" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "name" character varying(255) NOT NULL, "link" character varying NOT NULL, "admin_id" integer NOT NULL, "onboarding_link" character varying NOT NULL, "default_currency_id" integer, "customer_ltv" bigint, "acrvv" double precision, CONSTRAINT "REL_8f16a928610cac51fb69bdef29" UNIQUE ("admin_id"), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "currencies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "name" character varying NOT NULL, CONSTRAINT "PK_d528c54860c4182db13548e08c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "is_one_time" boolean NOT NULL, "upload_frequency" character varying NOT NULL, "amount" double precision NOT NULL, "currency_id" integer NOT NULL, "budget" double precision NOT NULL, "business_channel_id" integer NOT NULL, CONSTRAINT "REL_b6e76fe22e4e0a47db87a28d03" UNIQUE ("business_channel_id"), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."send_to_enum" AS ENUM('email', 'phone')`,
    );
    await queryRunner.query(
      `CREATE TABLE "follow_ups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "scheduled_at" date NOT NULL, "send_to" "public"."send_to_enum" NOT NULL, "business_channel_alert_id" integer, "business_channel_id" integer NOT NULL, CONSTRAINT "PK_d510aabdff2ec7fdc67a1092157" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "text" character varying NOT NULL, "color" character varying NOT NULL, "active" boolean NOT NULL, "business_channel_id" integer NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_channel" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "business_id" integer NOT NULL, "channel_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_b3c86a99c38fc195cd1658c610f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "business_channel_alert" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "alert_id" integer NOT NULL, "business_channel_id" integer NOT NULL, CONSTRAINT "PK_1eadd9864f76cd9658c5eecd1da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "alerts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" bigint, "updated_by" bigint, "name" character varying NOT NULL, "color" character varying NOT NULL, "priority" integer NOT NULL, CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_notes" ADD CONSTRAINT "FK_e30c87ec7f98d46bd09989c97eb" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_notes" ADD CONSTRAINT "FK_4723a501e835e303de1208f9b90" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_notes" ADD CONSTRAINT "FK_762ce0f3d0c508315c2283b72f9" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_notes" ADD CONSTRAINT "FK_ec808f0c98c0b8f03508235a033" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert_video" ADD CONSTRAINT "FK_9e969646ce221531933a934b109" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel_alert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert_video" ADD CONSTRAINT "FK_0a2aebcaac15925fa7a96d892ef" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" ADD CONSTRAINT "FK_7e64175265c1fb7d7bb02660537" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" ADD CONSTRAINT "FK_a4d37e2fb149dfefb29364efc5f" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_9ac9b8e338ba022557c58326b77" FOREIGN KEY ("channel_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_2d3770d775782d66fa16d84c49b" FOREIGN KEY ("business_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_488d80b6d175a467284fff40130" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channels" ADD CONSTRAINT "FK_280a077f06df221c462fb790af1" FOREIGN KEY ("influencer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "route_permissions" ADD CONSTRAINT "FK_1324d22842968c81b110fc30387" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "route_permissions" ADD CONSTRAINT "FK_f6e2fe76ea25598afd3dfdb2096" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboard_requests" ADD CONSTRAINT "FK_c52dc720f0fd6adb6d927387981" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_8f16a928610cac51fb69bdef299" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" ADD CONSTRAINT "FK_61b2965e8cfca4c966dfaad3b11" FOREIGN KEY ("default_currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_e2fa9937f78bad8bebaab2d4dbf" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_b6e76fe22e4e0a47db87a28d034" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow_ups" ADD CONSTRAINT "FK_59b8c21fb8e47c04927ade9a588" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow_ups" ADD CONSTRAINT "FK_a0a108be7904421a413a78e54a9" FOREIGN KEY ("business_channel_alert_id") REFERENCES "business_channel_alert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_ac9474f5d7a6ee3dfde4d500b6d" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" ADD CONSTRAINT "FK_bbe2b50c4bf8bde1e85a83f9f5e" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" ADD CONSTRAINT "FK_86b894b5db6c5d02ab7e5211ace" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" ADD CONSTRAINT "FK_7de9638eb0ea26952c65f846ef2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert" ADD CONSTRAINT "FK_ecd6b7db0596bbe3bf7b42c76ed" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert" ADD CONSTRAINT "FK_ea2854727dc2cd358dddba240fc" FOREIGN KEY ("business_channel_id") REFERENCES "business_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert" DROP CONSTRAINT "FK_ea2854727dc2cd358dddba240fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert" DROP CONSTRAINT "FK_ecd6b7db0596bbe3bf7b42c76ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" DROP CONSTRAINT "FK_7de9638eb0ea26952c65f846ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" DROP CONSTRAINT "FK_86b894b5db6c5d02ab7e5211ace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel" DROP CONSTRAINT "FK_bbe2b50c4bf8bde1e85a83f9f5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" DROP CONSTRAINT "FK_ac9474f5d7a6ee3dfde4d500b6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow_ups" DROP CONSTRAINT "FK_a0a108be7904421a413a78e54a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow_ups" DROP CONSTRAINT "FK_59b8c21fb8e47c04927ade9a588"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_b6e76fe22e4e0a47db87a28d034"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_e2fa9937f78bad8bebaab2d4dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "FK_61b2965e8cfca4c966dfaad3b11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business" DROP CONSTRAINT "FK_8f16a928610cac51fb69bdef299"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboard_requests" DROP CONSTRAINT "FK_c52dc720f0fd6adb6d927387981"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "route_permissions" DROP CONSTRAINT "FK_f6e2fe76ea25598afd3dfdb2096"`,
    );
    await queryRunner.query(
      `ALTER TABLE "route_permissions" DROP CONSTRAINT "FK_1324d22842968c81b110fc30387"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channels" DROP CONSTRAINT "FK_280a077f06df221c462fb790af1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_488d80b6d175a467284fff40130"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_2d3770d775782d66fa16d84c49b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_9ac9b8e338ba022557c58326b77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_a4d37e2fb149dfefb29364efc5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_7e64175265c1fb7d7bb02660537"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert_video" DROP CONSTRAINT "FK_0a2aebcaac15925fa7a96d892ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_alert_video" DROP CONSTRAINT "FK_9e969646ce221531933a934b109"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_notes" DROP CONSTRAINT "FK_ec808f0c98c0b8f03508235a033"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_notes" DROP CONSTRAINT "FK_762ce0f3d0c508315c2283b72f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_notes" DROP CONSTRAINT "FK_4723a501e835e303de1208f9b90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_channel_notes" DROP CONSTRAINT "FK_e30c87ec7f98d46bd09989c97eb"`,
    );
    await queryRunner.query(`DROP TABLE "alerts"`);
    await queryRunner.query(`DROP TABLE "business_channel_alert"`);
    await queryRunner.query(`DROP TABLE "business_channel"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "follow_ups"`);
    await queryRunner.query(`DROP TYPE "public"."send_to_enum"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "currencies"`);
    await queryRunner.query(`DROP TABLE "business"`);
    await queryRunner.query(`DROP TABLE "onboard_requests"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "route_permissions"`);
    await queryRunner.query(`DROP TABLE "routes"`);
    await queryRunner.query(`DROP TABLE "channels"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TABLE "business_channel_alert_video"`);
    await queryRunner.query(`DROP TABLE "video_notes"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "business_channel_notes"`);
  }
}
