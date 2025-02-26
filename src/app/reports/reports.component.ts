import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import {
  AwsReportData,
  EcfsReportData,
  ReportService,
  sensors,
} from '../services/report.service';
import { EcfsData } from '../models/ecfs_model';
import { DataService } from '../services/service.service';
import { load } from 'ol/Image';
import { catchError, map, Observable, of } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    DatePicker,
    Select,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  providers: [ReportService],
  // encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent implements OnInit {
  selectedStation: string = 'AWS';

  selectedPeriod: string = 'dateRange';
  periodOptions = [
    { label: 'Daily', value: 'dateRange' },
    { label: 'Weekly', value: 'weekRange' },
    { label: 'Monthly', value: 'monthRange' },
    { label: 'Yearly', value: 'yearRange' },
  ];

  cols: Column[] = [];
  selectedColumns: Column[] = [];

  ecfs: EcfsReportData[] = [];
  aws: AwsReportData[] = [];

  fromDate = new Date();
  toDate = new Date();
  selectedWeek = new Date();
  selectedMonth = new Date();
  selectedYear = new Date();

  loading: boolean = true;

  constructor(private sensorService: ReportService) {}

  ngOnInit(): void {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
    
 ::ng-deep .p-datatable-thead{
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: var(--background-color) !important;
 } 
 ::ng-deep .p-multiselect-chip{
    background-color: grey !important;
    color: var(--main-text) !important;
 }

 ::ng-deep .p-datatable-header{
    background-color: var(--background-color) !important;
 }
 ::ng-deep .p-datatable-thead th{
    background-color: var(--background-color) !important;
    color: var(--main-text) !important;
 }
 ::ng-deep .p-datatable-tbody td{
    background-color: var(--background-color) !important;
    color: var(--main-text) !important;
    border-color: rgba(174, 174, 174, 0.186) !important;
 }

 ::ng-deep .p-paginator{
    background-color: var(--background-color) !important;
 }
      ::ng-deep .multidrop{
    max-width: 400px !important;
    background-color: var(--background-color) !important;
    color: var(--main-text) !important;
  }
  ::ng-deep .p-datatable-header{
    border-radius: 10px 10px 0px 0px;
  }
      ::ng-deep p-select .p-select-label{
    color: var(--main-text) !important;
  }
  ::ng-deep .p-inputtext{
    border-radius: 15px !important;
    background-color: black !important;
    color: var(--main-text) !important;

  }
    `;
    document.head.appendChild(styleElement);
    console.log(styleElement);
    // this.loading = false;
    // this.getSensors().subscribe((status) => {
    //   console.log('Sensor status:', status);
    //   this.loading = true;
    // });
    this.initializeColumns();
    this.onInitFetch();
    // this.getSensors();
  }

  initializeColumns() {
    this.cols = [
      { field: 'ecfs_id', header: 'ECFS ID' },
      { field: 'timestamp', header: 'Timestamp' },
      { field: 'record', header: 'Record' },
      { field: 'co2_molar_li', header: 'CO2 Molar' },
      { field: 'h2o_molar_li', header: 'H2O Molar' },
      { field: 'press_li', header: 'Pressure' },
      { field: 'temp_li', header: 'Temperature' },
      { field: 'ambient_pressure', header: 'Ambient Pressure' },
      { field: 'roll', header: 'Roll' },
      { field: 'pitch', header: 'Pitch' },
      { field: 'yaw', header: 'Yaw' },
    ];
    this.selectedColumns = [...this.cols];
  }

  selectStationoption(type: string) {
    this.selectedStation = type;

    if (this.selectedStation == 'ECFS') {
    } else if (this.selectedStation == 'AWS') {
    }
  }

  onPeriodChange(event: any) {
    // this.selectedPeriod = event.target.value
  }

  getSensors(): Observable<boolean> {
    return this.sensorService
      .getSensors('2024-01-04T03:10:00.050Z', '2024-12-31T23:59:59.999Z')
      .pipe(
        map((data: sensors) => {
          this.ecfs = data.ecfs;
          this.aws = data.aws;
          console.log('aws data', this.aws);
          console.log('ecfs data', this.ecfs);
          return this.ecfs.length !== 0;
        }),
        catchError((error) => {
          console.error('Error fetching sensors:', error);
          return of(false); // Return false in case of an error
        })
      );
  }

  private toISTISOString(date: Date): string {
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().slice(0, -1); // Remove 'Z' to avoid UTC indication
  }

  onInitFetch(): void {
    let formattedFromDate: string | null = null;
    let formattedToDate: string | null = null;

    let fromDate = this.fromDate || new Date();
    let toDate = this.toDate || new Date();

    this.fromDate.setHours(0, 0, 0, 0);

    formattedFromDate = this.toISTISOString(fromDate);
    formattedToDate = this.toISTISOString(toDate);

    this.loading = true;
    this.sensorService
      .getSensors('2024-01-04T03:10:00.050Z', '2024-12-31T23:59:59.999Z')
      .subscribe((data: sensors) => {
        this.ecfs = data.ecfs;
        this.aws = data.aws;
        console.log('aws data', this.aws);
        console.log('ecfs data', this.ecfs);
      });
  }

  onSubmit(): void {
    const { formattedFromDate, formattedToDate } = this.periodWise();
    this.sensorService
      .getSensors(formattedFromDate!, formattedToDate!)
      .subscribe((data: sensors) => {
        this.ecfs = data.ecfs;
        this.aws = data.aws;
        // this.loading = false;
        console.log('aws data on submit', this.aws);
        console.log('ecfs data on submit', this.ecfs);
      });
  }

  periodWise(): {
    formattedFromDate: string | null;
    formattedToDate: string | null;
  } {
    let formattedFromDate: string | null = null;
    let formattedToDate: string | null = null;

    let fromDate = this.fromDate || new Date();
    let toDate = this.toDate || new Date();

    switch (this.selectedPeriod) {
      case 'dateRange':
        formattedFromDate = this.fromDate
          ? this.toISTISOString(this.fromDate)
          : this.toISTISOString(fromDate);
        formattedToDate = this.toDate
          ? this.toISTISOString(this.toDate)
          : this.toISTISOString(toDate);
        break;

      case 'weekRange':
        const startOfWeek = new Date(this.selectedWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        formattedFromDate = this.toISTISOString(startOfWeek);

        const endofWeek = this.endOfWeek(this.selectedWeek);
        formattedToDate = this.toISTISOString(endofWeek);
        break;

      case 'monthRange':
        formattedFromDate = this.selectedMonth
          ? `${this.selectedMonth.getFullYear()}-${(
              this.selectedMonth.getMonth() + 1
            )
              .toString()
              .padStart(2, '0')}-01T00:00:00`
          : null;

        const monthEndDate = new Date(
          this.selectedMonth.getFullYear(),
          this.selectedMonth.getMonth() + 1,
          0
        );
        formattedToDate = monthEndDate
          ? `${monthEndDate.toISOString().split('T')[0]}T23:59:59`
          : null;
        break;

      case 'yearRange':
        const year = this.selectedYear.getFullYear();

        formattedFromDate = `${year}-01-01T00:00:00.000Z`;
        formattedToDate = `${year}-12-31T23:59:59.000Z`;
        break;
      default:
        break;
    }
    return { formattedFromDate, formattedToDate };
  }

  endOfWeek(startDate: Date): Date {
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }

  // getSensordata() {
  //   this.ser.getEcfsData().subscribe((data: EcfsData[]) => {
  //     this.ecfs = data;
  //     console.log('ECFS data', this.ecfs);
  //     if (this.ecfs.length > 0) {
  //       this.cols = Object.keys(this.ecfs[0]).map((key) => ({
  //         field: key,
  //         header: this.formatHeader(key),
  //       }));

  //       this.selectedColumns = [...this.cols];
  //     }
  //   });
  // }

  // formatHeader(key: string): string {
  //   return key
  //     .replace(/_/g, ' ')
  //     .replace(/\b\w/g, (char) => char.toUpperCase());
  // }
}
