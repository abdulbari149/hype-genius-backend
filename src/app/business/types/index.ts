import ChannelEntity from 'src/app/channels/entities/channels.entity';
import UserEntity from 'src/app/users/entities/user.entity';

type BaseKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

type InfluencerType = Pick<
  UserEntity,
  BaseKeys | 'firstName' | 'lastName' | 'email' | 'phoneNumber'
>;

type ContractType = {
  id: number;
  amount: number;
  isOneTime: boolean;
  uploadFrequency: string;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

type ChannelType = Pick<ChannelEntity, BaseKeys | 'name' | 'link'> & {
  influencerId: number;
};

export type BusinessChannelType = {
  id: number;
  business_id: number;
  channel_id: number;
  influencer: InfluencerType;
  contract: ContractType | null;
  channel: ChannelType | null;
};

export type AlertType = {
  businessChannelId: number;
  id: number;
  priority: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type TagType = {
  id: number;
  name: string;
  color: string;
  businessChannelId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type GetInfluencersReturnType = BusinessChannelType & {
  tags: Array<TagType> | null;
  alert: AlertType;
  paymentStatus?: 'paid' | 'unpaid';
};
