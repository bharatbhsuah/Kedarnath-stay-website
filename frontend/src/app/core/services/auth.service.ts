import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  guest_id?: string;
  name: string;
  email: string | null;
  phone?: string;
  role: 'customer' | 'admin' | 'hotel-admin';
  hotelId?: number | null;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface PhoneLoginResponse {
  guest_id: string;
  token: string;
  exists: boolean;
  name: string;
  phone: string;
  email: string | null;
}

export interface PhoneLoginResult {
  user: User;
  exists: boolean;
  generatedCredentials?: {
    loginId: string;
    password: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(phone: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { phone, password })
      .pipe(
        tap((res) => this.setToken(res.token)),
        map((res) => res.user)
      );
  }

  register(payload: {
    name: string;
    email?: string;
    password: string;
    phone?: string;
  }): Observable<User> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(
        tap((res) => this.setToken(res.token)),
        map((res) => res.user)
      );
  }

  phoneLogin(payload: { phone: string; name: string; email?: string }): Observable<PhoneLoginResult> {
    return this.http
      .post<PhoneLoginResponse>(`${environment.apiUrl}/auth/phone-login`, payload)
      .pipe(
        tap((res) => this.setToken(res.token)),
        map((res) => {
          const user: User = {
            id: Number(res.guest_id),
            guest_id: res.guest_id,
            name: res.name,
            phone: res.phone,
            email: res.email,
            role: 'customer',
            hotelId: null
          };
          return {
            user,
            exists: res.exists,
            generatedCredentials: res.exists
              ? undefined
              : {
                  loginId: res.phone,
                  password: `${res.phone}@pass`
                }
          };
        })
      );
  }

  me(): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/auth/me`).pipe(
      map((res) => ({
        id: Number(res.id || res.guest_id),
        guest_id: String(res.guest_id || res.id),
        name: res.name,
        phone: res.phone,
        email: res.email ?? null,
        role: (res.role || 'customer') as User['role'],
        hotelId: res.hotel_id ?? res.hotelId ?? null
      }))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(payloadBase64));
      return {
        id: payload.id,
        guest_id: String(payload.id),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        hotelId: payload.hotelId ?? null
      };
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && (user.role === 'admin' || user.role === 'hotel-admin');
  }
}

