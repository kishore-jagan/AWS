import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, from, throwError } from 'rxjs';

export interface EcfsReportData {
  ecfs_id: number;
  timestamp: string;
  record: string;
  co2_molar_li: number;
  h2o_molar_li: number;
  co2_ab_li: number;
  h2o_ab_li: number;
  press_li: number;
  temp_li: number;
  aux_li: number;
  cooler_volt_li: number;
  diagval_li: number;
  out_bw_li: number;
  pg_delay_li: number;
  ux: number;
  uy: number;
  uz: number;
  ts: number;
  x_accel: number;
  y_accel: number;
  z_accel: number;
  x_gyro: number;
  y_gyro: number;
  z_gyro: number;
  x_mag: number;
  y_mag: number;
  z_mag: number;
  ambient_pressure: number;
  roll: number;
  pitch: number;
  yaw: number;
  quaternion_q0: number;
  quaternion_q1: number;
  quaternion_q2: number;
  quaternion_q3: number;
  imu_gps_correl_timestamp_tow: number;
  imu_gps_week_number: number;
  imu_timestamp_flags: number;
}

export interface AwsReportData {
  aws_id: number;
  timestamp: string;
  record: number;
  winddir_uc: number;
  ws: number;
  winddir_cc: number;
  ws_cc: number;
  bp: number;
  rh: number;
  airtemp: number;
  dp: number;
  metsens_volts: number;
  metsens_status: number;
  rain_mm: number;
  sbtempc: number;
  targtempc: number;
  pyr1_w_irr_tc: number;
  pyr1_w_bodytemp: number;
  pyr2_w_irr_tc: number;
  pyr2_w_bodytemp: number;
  long_rad_tc: number;
  gps_lat: number;
  gps_lon: number;
  [key: string]: string | number | undefined;
}

export interface sensors {
  ecfs: EcfsReportData[];
  aws: AwsReportData[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/getSensorsData';

  constructor(private http: HttpClient) {}

  getSensors(fromDate: string, toDate: string): Observable<sensors> {
    console.log('Fetching sensors data from', fromDate, 'to', toDate);

    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<sensors>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('HTTP error:', error);
        return throwError(error);
      })
    );
  }
}
