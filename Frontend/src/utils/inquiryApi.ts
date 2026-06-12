import { apiClient } from './apiClient';

export type InquiryCategory =
  | 'SERVICE_USAGE'
  | 'ACCOUNT_LOGIN'
  | 'GROUP_OPERATION'
  | 'MATCH_RECORD_MMR'
  | 'ERROR_REPORT'
  | 'PRIVACY_RIGHTS'
  | 'REPORT_POLICY'
  | 'OTHER';

export type CreateInquiryRequest = {
  category: InquiryCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
};

export type CreateInquiryResponse = {
  id: number;
  status: 'RECEIVED';
  createdAt: string;
};

export function createInquiry(request: CreateInquiryRequest) {
  return apiClient.post<CreateInquiryResponse>('/inquiries', request);
}
