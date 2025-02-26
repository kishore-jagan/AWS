import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import * as echarts from 'echarts';
import {
  AwsReportData,
  EcfsReportData,
  ReportService,
  sensors,
} from '../services/report.service';
import { EcfsData } from '../models/ecfs_model';
import { DataService } from '../services/service.service';
import { catchError, map, Observable, of } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePicker, Select],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  providers: [ReportService],
})
export class AnalyticsComponent implements OnInit {
  loading: boolean = false;

  selectedStation: string = 'AWS';

  selectedPeriod: string = 'dateRange';
  periodOptions = [
    { label: 'Daily', value: 'dateRange' },
    { label: 'Weekly', value: 'weekRange' },
    { label: 'Monthly', value: 'monthRange' },
    { label: 'Yearly', value: 'yearRange' },
  ];

  selectedChart: string = 'line';
  chartOptions = [
    { label: 'Line Plot', value: 'line' },
    { label: 'Scatter Series', value: 'scatter' },
    { label: 'Bar Plot', value: 'bar' },
    { label: 'Polar plot', value: 'currentSpeed' },
  ];

  // ecfs: EcfsData[] = [];
  ecfs1: EcfsReportData[] = [];
  aws: AwsReportData[] = [];

  fromDate = new Date();
  toDate = new Date();
  selectedWeek = new Date();
  selectedMonth = new Date();
  selectedYear = new Date();

  constructor(
    private analyticsService: ReportService,
    private ser: DataService
  ) {}

  ngOnInit(): void {
    // this.getSensordata();
    this.onInitFetch();
  }

  // getSensordata() {
  //   this.analyticsService.getSensors().subscribe((data: sensors) => {
  //     this.ecfs = data.ecfs;
  //     console.log('ECFS data', this.ecfs);
  //   });
  // }

  selectStationoption(type: string) {
    this.selectedStation = type;

    if (this.selectedStation == 'ECFS') {
    } else if (this.selectedStation == 'AWS') {
    }
  }

  onPeriodChange(event: any) {
    // this.selectedPeriod = event.target.value
  }

  // getSensordata() {
  //   this.ser.getEcfsData().subscribe((data: EcfsData[]) => {
  //     this.ecfs = data;
  //     console.log('ECFS data', this.ecfs);
  //     this.Tide();
  //   });
  // }

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
    this.analyticsService
      .getSensors('2024-01-04T03:10:00.050Z', '2024-12-31T23:59:59.999Z')
      .subscribe((data: sensors) => {
        this.ecfs1 = data.ecfs;
        this.aws = data.aws;
        this.Tide();
        console.log('aws data', this.aws);
        console.log('ecfs data', this.ecfs1);
      });
  }

  onSubmit(): void {
    const { formattedFromDate, formattedToDate } = this.periodWise();
    this.analyticsService
      .getSensors(formattedFromDate!, formattedToDate!)
      .subscribe((data: sensors) => {
        this.ecfs1 = data.ecfs;
        this.aws = data.aws;
        this.Tide();
        // this.loading = false;
        console.log('aws data on submit', this.aws);
        console.log('ecfs data on submit', this.ecfs1);
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

  Tide(): void {
    const chartType = this.selectedChart;
    this.loading = true;
    // const tide = document.getElementById('tide');

    const computedStyle = getComputedStyle(document.body);
    const bgColor = computedStyle
      .getPropertyValue('--secbackground-color')
      .trim();
    const mainText = computedStyle.getPropertyValue('--chart-maintext').trim();
    const subText = computedStyle.getPropertyValue('--main-text').trim();

    const parameterKeys = [
      'winddir_uc',
      'ws',
      'winddir_cc',
      'ws_cc',
      'bp',
      'rh',
      'airtemp',
      'dp',
      'metsens_volts',
      'metsens_status',
      'rain_mm',
      'sbtempc',
      'targtempc',
      'pyr1_w_irr_tc',
      'pyr1_w_bodytemp',
      'pyr2_w_irr_tc',
      'pyr2_w_bodytemp',
      'long_rad_tc',
    ];

    parameterKeys.forEach((key) => {
      const chartContainer = document.getElementById(`chart-${key}`);
      if (!chartContainer) return;

      const existingInstance = echarts.getInstanceByDom(chartContainer);
      if (existingInstance) {
        existingInstance.dispose();
      }

      const chartData = this.aws.map((item) => [
        new Date(item.timestamp).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3,
        }),
        (item as Record<string, any>)[key] ?? null,
      ]);

      console.log('chart', chartData);

      const chartInstance = echarts.init(chartContainer);

      // const waterLevels =
      //   this.selectedStation === 'cwprs01'
      //     ? this.cwprs01.map((item) => item.S1_RelativeWaterLevel)
      //     : this.selectedStation === 'cwprs02'
      //     ? this.cwprs02.map((item) => item.S1_RelativeWaterLevel)
      //     : [];

      // const dates =
      //   this.selectedStation === 'cwprs01'
      //     ? this.cwprs01.map(
      //         (item) =>
      //           `${item.Date?.split('T')[0]} ${
      //             item.Time?.split('T')[1]?.split('.')[0]
      //           }`
      //       )
      //     : this.selectedStation === 'cwprs02'
      //     ? this.cwprs02.map(
      //         (item) =>
      //           `${item.Date?.split('T')[0]} ${
      //             item.Time?.split('T')[1]?.split('.')[0]
      //           }`
      //       )
      //     : [];

      //Without model and fetch with date and time

      // const dates = this.cwprs01.map(item =>`${item.Date?.split('T')[0]}`);
      //Without model and fetch with date only

      // Retrieve theme variables

      const option = {
        title: {
          text: `${key.toUpperCase()} Chart`,
          left: '1%',
          textStyle: {
            color: mainText,
            fontSize: 20,
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          // top: '50%',
          left: '7%',
          // right: '10%',
          bottom: '30%',
          // containLabel: true
        },
        xAxis: {
          type: 'category',
          name: 'Time', // X-axis legend (title)
          nameLocation: 'middle',
          // data: chartData.map((d) => d[0]),
          nameTextStyle: {
            color: mainText,
            padding: [35, 0, 0, 0],
            fontSize: 16,
          },
          // data: dates,
          axisLabel: {
            color: subText, // Set x-axis label color to white
            rotate: 45,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false, // Hide x-axis grid lines
          },
        },

        yAxis: {
          name: key.toUpperCase(), // Y-axis legend (title)
          nameLocation: 'middle',
          // data: chartData.map((d) => d[1]),
          nameTextStyle: {
            color: mainText,
            padding: [0, 0, 30, 0],
            fontSize: 16,
          },
          // type: 'value'
          axisLabel: {
            color: subText, // Set y-axis label color to white
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true, // Hide x-axis grid lines
            lineStyle: {
              color: subText,
              type: 'dashed',
            },
          },
        },

        legend: {
          // type: 'scroll',
          orient: 'vertical', // Orient the legend vertically
          right: '15%',
          top: '2%',
          // top: 'middle',
          textStyle: {
            color: subText, // Set legend text color to white
            fontSize: 14,
          },
        },

        toolbox: {
          // right: 10,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              title: {
                zoom: 'Zoom',
                back: 'Reset Zoom',
              },
            },
            restore: {},
            saveAsImage: {
              backgroundColor: bgColor,
              pixelRatio: 2,
            },
          },
          iconStyle: {
            borderColor: mainText,
          },
        },

        dataZoom: [
          {
            type: 'slider',
            // bottom: 15,
            height: 20,
            start: 0, // You can adjust to define how much of the chart is visible initially
            end: 100, // Set the percentage of the range initially visible
          },
          {
            type: 'inside',
            start: 0,
            end: 100, // Can be modified based on your dataset's initial view preference
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
          },
        ],

        series: [
          {
            name: key.toUpperCase(),
            data: chartData,
            type: 'line', // Change to 'bar' or 'scatter' dynamically if needed
            smooth: true,
            lineStyle: { color: '#1ee1ff' },
            itemStyle: { color: '#1ee1ff' },
            showSymbol: false,
          },
        ],
      };

      chartInstance.setOption(option);
      window.addEventListener('resize', () => chartInstance.resize());
    });

    this.loading = false;
  }
}
