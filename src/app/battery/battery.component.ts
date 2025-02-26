import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-battery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battery.component.html',
  styleUrl: './battery.component.css',
})
export class BatteryComponent implements OnInit {
  @Input() batteryLevel: number = 6.4;
  public batteryColor: string = 'green';
  public fillHeight: string = '0%';

  above_warning: number = 6;
  below_warning: number = 10;
  above_danger: number = 2;
  below_danger: number = 5;

  ngOnInit(): void {
    this.calculateBatteryColor();
    this.calculateBatteryFill();
  }

  calculateBatteryColor() {
    if (this.batteryLevel > this.below_warning) {
      this.batteryColor = 'green';
    } else if (
      this.batteryLevel <= this.below_warning &&
      this.batteryLevel > this.above_warning
    ) {
      this.batteryColor = 'orange';
    } else if (
      this.batteryLevel <= this.below_danger &&
      this.batteryLevel > this.above_warning
    ) {
      this.batteryColor = 'red';
    } else {
      this.batteryColor = 'yellow';
    }
  }

  calculateBatteryFill() {
    const maxLevel = 12.4;
    const minLevel = 0;
    const fillPercentage =
      ((this.batteryLevel - minLevel) / (maxLevel - minLevel)) * 100;

    this.fillHeight =
      fillPercentage > 100
        ? '100%'
        : fillPercentage < 0
        ? '0%'
        : fillPercentage + '%';
  }
}
