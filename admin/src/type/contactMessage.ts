export interface ContactMessageDto {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  note?: string | null;
  handledBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagePageResponse {
  content: ContactMessageDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

