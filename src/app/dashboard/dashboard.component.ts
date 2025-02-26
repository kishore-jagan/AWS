import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Feature from 'ol/Feature';
import { Point, Circle as circleGeom } from 'ol/geom';
import { Circle } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import Text from 'ol/style/Text';
import { DataService } from '../services/service.service';
import { response } from 'express';
import { error } from 'console';
import { AwsData, EcfsData } from '../models/ecfs_model';

import { BatteryComponent } from '../battery/battery.component';
import { interval, pipe, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import Overlay from 'ol/Overlay';

interface listModel {
  name: string;
  value: string;
  img: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BatteryComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;
  map!: Map;
  latLong: [number, number] = fromLonLat([80.2705, 13.0843]) as [
    number,
    number
  ];
  vectorLayer!: VectorLayer;
  overlay!: Overlay;
  popupContent: string = '';

  sensorList: string[] = ['AWS', 'ECFS'];
  sensorSelect: string = this.sensorList[0];

  isECFSSelected: boolean = true;

  ecfsdata: EcfsData[] = [];
  ecfslastRow?: EcfsData;

  awsdata: AwsData[] = [];
  awslastRow?: AwsData;

  ecfslist: listModel[] = [];
  awsList: listModel[] = [];

  battery: number = 10;

  constructor(private dataService: DataService) {}

  toggleSensor() {
    this.sensorSelect = this.isECFSSelected ? 'ECFS' : 'AWS';
  }
  ngOnInit(): void {
    this.mapInit();
    this.getEcfsData();
    this.getAwsData();
    console.log('ecfs:', this.ecfslastRow?.timestamp);
  }

  assignecfslist() {
    const list = [
      {
        name: 'co2_molar_li',
        value: this.ecfslastRow!.co2_molar_li.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'H2O_molar_li',
        value: this.ecfslastRow!.h2o_molar_li.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'CO2_Ab_li',
        value: this.ecfslastRow!.co2_ab_li.toString(),
        img: '../../assets/svg/admin_setting.svg',
      },
      {
        name: 'H2O_Ab_li',
        value: this.ecfslastRow!.h2o_ab_li.toString(),
        img: '../../assets/svg/level.svg',
      },
      {
        name: 'Press_li',
        value: this.ecfslastRow!.press_li.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Temperature_li',
        value: this.ecfslastRow!.temp_li.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Aux_li',
        value: this.ecfslastRow!.aux_li.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Ux',
        value: this.ecfslastRow!.ux.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Uy',
        value: this.ecfslastRow!.uy.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Uz',
        value: this.ecfslastRow!.uz.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'TS',
        value: this.ecfslastRow!.ts.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'XAccel',
        value: this.ecfslastRow!.x_accel.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'YAccel',
        value: this.ecfslastRow!.y_accel.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'ZAccel',
        value: this.ecfslastRow!.z_accel.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'XGyro',
        value: this.ecfslastRow!.x_gyro.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'YGyro',
        value: this.ecfslastRow!.y_gyro.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'ZGyro',
        value: this.ecfslastRow!.z_gyro.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'XMag',
        value: this.ecfslastRow!.x_mag.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'YMag',
        value: this.ecfslastRow!.y_mag.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'ZMag',
        value: this.ecfslastRow!.z_mag.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Ambient Pressure',
        value: this.ecfslastRow!.ambient_pressure.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Roll',
        value: this.ecfslastRow!.roll.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Pitch',
        value: this.ecfslastRow!.pitch.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'Yaw',
        value: this.ecfslastRow!.yaw.toString(),
        img: '../../assets/svg/leaf.svg',
      },
      {
        name: 'IMU',
        value: this.ecfslastRow!.imu_timestamp_flags.toString(),
        img: '../../assets/svg/leaf.svg',
      },
    ];

    // console.log('ecfs list', list);
    this.ecfslist = list;
  }

  assignawsList() {
    const list = [
      {
        name: 'Winddir_uc',
        value: this.awslastRow!.winddir_uc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Ws',
        value: this.awslastRow!.ws.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Winddir_cc',
        value: this.awslastRow!.winddir_cc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Ws_cc',
        value: this.awslastRow!.ws_cc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Bp',
        value: this.awslastRow!.bp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Rh',
        value: this.awslastRow!.rh.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Airtemp',
        value: this.awslastRow!.airtemp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'dp',
        value: this.awslastRow!.dp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Metsens_volts',
        value: this.awslastRow!.metsens_volts.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Metsons_status',
        value: this.awslastRow!.metsens_status.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Rain_mm',
        value: this.awslastRow!.rain_mm.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Sbtempc',
        value: this.awslastRow!.sbtempc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Targtempc',
        value: this.awslastRow!.targtempc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyr1_w_irr_tc',
        value: this.awslastRow!.pyr1_w_irr_tc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyr1_w_bodytemp',
        value: this.awslastRow!.pyr1_w_bodytemp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyr2_w_irr_tc',
        value: this.awslastRow!.pyr2_w_irr_tc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyr2_w_bodytemp',
        value: this.awslastRow!.pyr2_w_bodytemp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Long_rad_tc',
        value: this.awslastRow!.long_rad_tc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Gps_lat',
        value: this.awslastRow!.gps_lat.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Gps_lon',
        value: this.awslastRow!.gps_lon.toString(),
        img: '../../assets/svg/meter.svg',
      },
    ];
    // console.log('awslist', list);
    this.awsList = list;
  }

  getEcfsData() {
    this.dataService.getEcfsData().subscribe(
      (response: EcfsData[]) => {
        this.ecfsdata = response;
        // console.log('All ecfs data', this.ecfsdata);

        if (this.ecfsdata.length > 0) {
          this.ecfslastRow = this.ecfsdata[this.ecfsdata.length - 1];
          if (this.ecfslastRow) {
            this.assignecfslist();
            // console.log('ecfs has data');
          }
        }
        // console.log('ecfs Last row data:', this.ecfslastRow);
      },
      (error) => {
        // console.error('error:', error);
      }
    );
  }

  getAwsData() {
    this.dataService.getAwsData().subscribe(
      (response: AwsData[]) => {
        this.awsdata = response;
        // console.log('All Aws data', this.awsdata);

        if (this.awsdata.length > 0) {
          this.awslastRow = this.awsdata[this.awsdata.length - 1];
          if (this.awslastRow) {
            this.assignawsList();
            // console.log('aws has data');
          }
        }
        // console.log('last awsrowdata', this.awslastRow);
      },
      (error) => {
        console.error('error', error);
      }
    );
  }

  mapInit() {
    const mapContainer = document.getElementById('map1');

    if (!mapContainer) {
      console.error('Map not Found');
      return;
    }

    const iconFeature = new Feature({
      geometry: new Point(this.latLong),
    });

    // const circleFeature = new Feature({
    //   geometry: new circleGeom(this.latLong, 40000),
    // });

    iconFeature.setStyle(
      new Style({
        image: new Icon({
          // src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          src: 'assets/awsimage-removebg-preview.png',
          scale: 1.2,
        }),
        text: new Text({
          // text: 'Bouy 1',
          font: '12px Arial, sans-serif', // Font style
          fill: new Fill({ color: '#000' }), // Text color
          stroke: new Stroke({ color: '#fff', width: 2 }), // Outline for better visibility
          offsetY: -20, // Offset the text above the icon
        }),
      })
    );

    // circleFeature.setStyle(
    //   new Style({
    //     fill: new Fill({ color: '#fff' }),
    //     stroke: new Stroke({ color: '#000', width: 2 }),
    //   })
    // );

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(0, 149, 255, 0.5)' }), // Custom water color
      }),
    });

    this.map = new Map({
      target: 'map1',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            // url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            // url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            // url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          }),
        }),
        vectorLayer,
      ],
      view: new View({
        center: this.latLong,
        zoom: 5,
      }),
    });
  }
}
