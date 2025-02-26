import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { LayoutComponent } from '../../layout/layout.component';
import * as echarts from 'echarts';

@Component({
  selector: 'app-speed',
  standalone: true,
  imports: [],
  templateUrl: './speed.component.html',
  styleUrl: './speed.component.css',
})
export class SpeedComponent implements AfterViewInit, OnChanges {
  @Input() gaugeId!: string; // Dynamically assigned ID
  @Input() value!: number;
  speedType: string = '';
  isBig: boolean = true;
  issBig: boolean = true;
  fontSize!: number;
  length!: number;
  width!: number;
  distance!: number;
  margin!: string;

  getScreenSize() {
    const wid = window.innerWidth;
    const hei = window.innerHeight;
    if (hei <= 700) {
      this.issBig = false;
    } else {
      this.issBig = true;
    }
    if (wid <= 1300) {
      this.isBig = false;
    } else {
      this.isBig = true;
    }
  }
  constructor(private lay: LayoutComponent) {}
  ngAfterViewInit(): void {
    this.getScreenSize();
    this.data();
    this.initChart();
  }
  data() {
    this.speedType = 'knot';
    //console.log(this.speedType);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.initChart();
    }
  }

  getColorForValue(value: number): string {
    if (value >= 0 && value < 1.2) {
      return '#008000'; // Light blue for 0-12
    } else if (value >= 1.2 && value < 2.8) {
      return '#37a2da'; // Blue for 12-28
    } else {
      return '#fd666d'; // Red for above 28
    }
  }

  initChart(): void {
    const chartDom = document.getElementById(this.gaugeId)!; // Use dynamic ID
    const myChart = echarts.init(chartDom);
    console.log(chartDom);
    const valueColor = this.getColorForValue(this.value);
    const option = {
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 4,
          axisLine: {
            lineStyle: {
              width: this.isBig ? 10 : 5,
              color: [
                [0.3, '#008000'],
                [0.7, '#37a2da'],
                [1, '#fd666d'],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: valueColor,
            },
          },
          axisTick: {
            distance: this.isBig ? -9 : -5,
            length: this.isBig ? 9 : 5,
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
          splitLine: {
            distance: this.isBig ? -10 : -4,
            length: this.isBig ? 11 : 4,
            lineStyle: {
              color: '#fff',
              width: 4,
            },
          },
          axisLabel: {
            color: 'inherit',
            distance: 15,
            fontSize: this.isBig ? 10 : 8,
          },
          detail: {
            valueAnimation: true,
            formatter: (value: number) => {
              return `${value.toFixed(2)} ${this.speedType}`; // Use value for the gauge
            },
            color: valueColor,
            fontSize: 19,
            offsetCenter: [0, this.issBig ? '100%' : '110%'],
          },
          data: [
            {
              value: this.value,
            },
          ],
        },
      ],
    };
    myChart.setOption(option);
  }
}
