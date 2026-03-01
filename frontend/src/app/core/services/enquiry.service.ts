import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  interestedIn?: string;
  approxGuests?: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  constructor(private http: HttpClient) {}

  submitEnquiry(payload: EnquiryPayload): Observable<any> {
    return this.http.post(`${environment.apiUrl}/enquiry`, payload);
  }
}

