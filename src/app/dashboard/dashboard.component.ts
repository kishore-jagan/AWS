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
import { DirectionComponent } from './direction/direction.component';
import { SpeedComponent } from './speed/speed.component';

interface listModel {
  name: string;
  value: string;
  img: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BatteryComponent,
    DirectionComponent,
    SpeedComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard2.component.css',
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;
  map!: Map;
  speed: number = 2;
  latLong: [number, number] = fromLonLat([80.2705, 13.0843]) as [
    number,
    number
  ];
  vectorLayer!: VectorLayer;
  overlay!: Overlay;
  popupContent: string = '';

  sensorList: string[] = ['ECFS', 'AWS'];
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
        name: 'Carbon Dioxide Molar Concentration (LI-COR)',
        value: this.ecfslastRow!.co2_molar_li.toString(),
        img: '../../assets/ecfs/co2molar.svg',
      },
      {
        name: 'Water Vapor Molar Concentration (LI-COR)',
        value: this.ecfslastRow!.h2o_molar_li.toString(),
        img: '../../assets/ecfs/water.svg',
      },
      {
        name: 'Carbon Dioxide Absorption (LI-COR)',
        value: this.ecfslastRow!.co2_ab_li.toString(),
        img: '../../assets/ecfs/co2molar.svg',
      },
      {
        name: 'Water Vapor Absorption (LI-COR)',
        value: this.ecfslastRow!.h2o_ab_li.toString(),
        img: '../../assets/ecfs/water.svg',
      },
      {
        name: 'Pressure (LI-COR)',
        value: this.ecfslastRow!.press_li.toString(),
        img: '../../assets/ecfs/pressure.svg',
      },
      {
        name: 'Temperature (LI-COR)',
        value: this.ecfslastRow!.temp_li.toString(),
        img: '../../assets/ecfs/temperture.svg',
      },
      {
        name: 'Auxiliary Data (LI-COR)',
        value: this.ecfslastRow!.aux_li.toString(),
        img: '../../assets/ecfs/auxilarydata.svg',
      },
      {
        name: 'Wind Velocity Component in X-Direction',
        value: this.ecfslastRow!.ux.toString(),
        img: '../../assets/ecfs/windsp.svg',
      },
      {
        name: 'Wind Velocity Component in Y-Direction',
        value: this.ecfslastRow!.uy.toString(),
        img: '../../assets/ecfs/windsp.svg',
      },
      {
        name: 'Wind Velocity Component in Z-Direction',
        value: this.ecfslastRow!.uz.toString(),
        img: '../../assets/ecfs/windsp.svg',
      },
      {
        name: 'Sonic Temperature',
        value: this.ecfslastRow!.ts.toString(),
        img: '../../assets/ecfs/solar.svg',
      },
      {
        name: 'Acceleration in X-Direction',
        value: this.ecfslastRow!.x_accel.toString(),
        img: '../../assets/ecfs/wind direction.svg',
      },
      {
        name: 'Acceleration in Y-Direction',
        value: this.ecfslastRow!.y_accel.toString(),
        img: '../../assets/ecfs/wind direction.svg',
      },
      {
        name: 'Acceleration in Z-Direction',
        value: this.ecfslastRow!.z_accel.toString(),
        img: '../../assets/ecfs/wind direction.svg',
      },
      {
        name: 'Gyroscope Measurement in X-Axis',
        value: this.ecfslastRow!.x_gyro.toString(),
        img: '../../assets/ecfs/gyroscope.svg',
      },
      {
        name: 'Gyroscope Measurement in Y-Axis',
        value: this.ecfslastRow!.y_gyro.toString(),
        img: '../../assets/ecfs/gyroscope.svg',
      },
      {
        name: 'Gyroscope Measurement in Z-Axis',
        value: this.ecfslastRow!.z_gyro.toString(),
        img: '../../assets/ecfs/gyroscope.svg',
      },
      {
        name: 'Magnetic Field in X-Direction',
        value: this.ecfslastRow!.x_mag.toString(),
        img: '../../assets/ecfs/magnetic.svg',
      },
      {
        name: 'Magnetic Field in Y-Direction',
        value: this.ecfslastRow!.y_mag.toString(),
        img: '../../assets/ecfs/magnetic.svg',
      },
      {
        name: 'Magnetic Field in Z-Direction',
        value: this.ecfslastRow!.z_mag.toString(),
        img: '../../assets/ecfs/magnetic.svg',
      },
      {
        name: 'Ambient Pressure',
        value: this.ecfslastRow!.ambient_pressure.toString(),
        img: '../../assets/ecfs/pressure.svg',
      },
      {
        name: 'Roll',
        value: this.ecfslastRow!.roll.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pitch',
        value: this.ecfslastRow!.pitch.toString(),
        img: '../../assets/svg/level.svg',
      },
      {
        name: 'Yaw',
        value: this.ecfslastRow!.yaw.toString(),
        img: '../../assets/svg/o2.svg',
      },
      {
        name: 'IMU',
        value: this.ecfslastRow!.imu_timestamp_flags.toString(),
        img: '../../assets/svg/meter.svg',
      },
    ];

    // console.log('ecfs list', list);
    this.ecfslist = list;
  }

  assignawsList() {
    const list = [
      {
        name: 'Wind Direction uc',
        value: this.awslastRow!.winddir_uc.toString(),
        img: '../../assets/ecfs/wind direction.svg',
      },
      {
        name: 'Wind Speed uc',
        value: this.awslastRow!.ws.toString(),
        img: '../../assets/ecfs/windsp.svg',
      },
      {
        name: 'Wind Dirrection cc',
        value: this.awslastRow!.winddir_cc.toString(),
        img: '../../assets/ecfs/wind direction.svg',
      },
      {
        name: 'Wind Speed cc',
        value: this.awslastRow!.ws_cc.toString(),
        img: '../../assets/ecfs/windsp.svg',
      },
      {
        name: 'Barometric Pressure',
        value: this.awslastRow!.bp.toString(),
        img: '../../assets/ecfs/barometric.svg',
      },
      {
        name: 'Relative Humidity',
        value: this.awslastRow!.rh.toString(),
        img: '../../assets/ecfs/humid.svg',
      },
      {
        name: 'Air Temperature',
        value: this.awslastRow!.airtemp.toString(),
        img: '../../assets/ecfs/relativehumidity.svg',
      },
      {
        name: 'Dew Point Temperature',
        value: this.awslastRow!.dp.toString(),
        img: '../../assets/ecfs/point.svg',
      },
      {
        name: 'Meteorological Sensor Voltage',
        value: this.awslastRow!.metsens_volts.toString(),
        img: '../../assets/ecfs/coolervoltage.svg',
      },
      {
        name: 'Meteorological Sensor Status',
        value: this.awslastRow!.metsens_status.toString(),
        img: '../../assets/ecfs/status.svg',
      },
      {
        name: 'Rainfall (in millimeters)',
        value: this.awslastRow!.rain_mm.toString(),
        img: '../../assets/ecfs/rain.svg',
      },
      {
        name: 'Sensor Body Temperature (Celsius)',
        value: this.awslastRow!.sbtempc.toString(),
        img: '../../assets/ecfs/temperture.svg',
      },
      {
        name: 'Target Temperature (Celsius)',
        value: this.awslastRow!.targtempc.toString(),
        img: '../../assets/ecfs/temperture.svg',
      },
      {
        name: 'Pyranometer 1 Wideband Irradiance (Thermocouple Corrected)',
        value: this.awslastRow!.pyr1_w_irr_tc.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyranometer 1 Wideband Body Temperature',
        value: this.awslastRow!.pyr1_w_bodytemp.toString(),
        img: '../../assets/svg/meter.svg',
      },
      {
        name: 'Pyranometer 2 Wideband Irradiance (Thermocouple Corrected)',
        value: this.awslastRow!.pyr2_w_irr_tc.toString(),
        img: '../../assets/svg/level.svg',
      },
      {
        name: 'Pyranometer 2 Wideband Body Temperature',
        value: this.awslastRow!.pyr2_w_bodytemp.toString(),
        img: '../../assets/svg/level.svg',
      },
      {
        name: 'Longwave Radiation (Thermocouple Corrected)',
        value: this.awslastRow!.long_rad_tc.toString(),
        img: '../../assets/ecfs/solar.svg',
      },
      {
        name: 'GPS - Latitude',
        value: this.awslastRow!.gps_lat.toString(),
        img: '../../assets/aws/map.svg',
      },
      {
        name: 'GPS - Longitude',
        value: this.awslastRow!.gps_lon.toString(),
        img: '../../assets/aws/map.svg',
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

  buoyLocations = [
    {
      name: 'ECFS_Ship',
      coordinates: [82.26975, 13.00475],
      description: 'ECFS SHIP',
      img: 'assets/Sagar_Nidhi.png',
    },
    {
      name: 'AWS 2',
      coordinates: [76.9558, 11.0168],
      description: 'Weather Station 2',
      img: 'assets/aws/aws1.svg',
    },
    {
      name: 'AWS 3',
      coordinates: [78.7047, 10.7905],
      description: 'Weather Station 3',
      img: 'assets/aws/aws1.svg',
    },
    {
      name: 'AWS 4',
      coordinates: [77.5946, 12.9716],
      description: 'Weather Station 4',
      img: 'assets/aws/aws1.svg',
    },
    {
      name: 'AWS 5',
      coordinates: [78.4772, 17.4065],
      description: 'Weather Station 5',
      img: 'assets/aws/aws1.svg',
    },
  ];

  mapInit() {
    const mapContainer = document.getElementById('map1');

    if (!mapContainer) {
      console.error('Map not Found');
      return;
    }

    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
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
        this.vectorLayer,
      ],
      view: new View({
        center: this.latLong,
        zoom: 5,
      }),
    });
    this.updateMarkers();
  }

  updateMarkers() {
    const vectorSource = new VectorSource();
    let filteredLocations = [];

    // Filter based on selected sensor
    if (this.sensorSelect === 'ECFS') {
      filteredLocations = this.buoyLocations.filter(
        (loc) => loc.name === 'ECFS_Ship'
      );
    } else {
      filteredLocations = this.buoyLocations.filter(
        (loc) => loc.name !== 'ECFS_Ship'
      );
    }

    // Add features dynamically
    filteredLocations.forEach((buoy) => {
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat(buoy.coordinates)),
        name: buoy.name,
        description: buoy.description,
      });

      iconFeature.setStyle(
        new Style({
          image: new Icon({
            src: buoy.img,
            scale: 0.2,
          }),
          text: new Text({
            font: '12px Arial, sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
            offsetY: -20,
          }),
        })
      );

      vectorSource.addFeature(iconFeature);
    });

    // Update the vector layer
    this.vectorLayer.setSource(vectorSource);
  }
  onSensorChange() {
    this.updateMarkers();
  }
}
