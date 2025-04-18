// 사용자 타입 정의
export interface User {
    id: number;
    name: string;
    role: 'doctor' | 'nurse';
    employee_id: string;
  }
  
  // 메시지 타입 정의
  export interface Message {
    id: number;
    content: string;
    sender: number;
    sender_id?: number;
    sender_name?: string;
    receiver: number;
    receiver_id?: number;
    receiver_name?: string;
    timestamp: string;
    is_read: boolean;
  }
  