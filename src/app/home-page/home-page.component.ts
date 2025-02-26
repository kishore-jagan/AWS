import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
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
import Overlay from 'ol/Overlay';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;
  map!: Map;
  vectorLayer!: VectorLayer;
  overlay!: Overlay;
  popupContent: string = '';

  @ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;

  buoyLocations = [
    {
      name: 'ECFS_Ship',
      coordinates: [82.26975, 13.00475],
      description: 'ECFS SHIP',
    },
    {
      name: 'AWS 2',
      coordinates: [76.9558, 11.0168],
      description: 'Weather Station 2',
    },
    {
      name: 'AWS 3',
      coordinates: [78.7047, 10.7905],
      description: 'Weather Station 3',
    },
    {
      name: 'AWS 4',
      coordinates: [77.5946, 12.9716],
      description: 'Weather Station 4',
    },
    {
      name: 'AWS 5',
      coordinates: [78.4772, 17.4065],
      description: 'Weather Station 5',
    },
  ];

  constructor(private cdRef: ChangeDetectorRef) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      setTimeout(() => this.mapInit(), 0);
    }
  }

  mapInit(): void {
    const mapContainer = document.getElementById('map');

    if (!mapContainer) {
      console.error('Map not Found');
      return;
    }

    const vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({ source: vectorSource });

    this.buoyLocations.forEach((buoy) => {
      const iconFeature = new Feature({
        geometry: new Point(fromLonLat(buoy.coordinates)),
        name: buoy.name,
        description: buoy.description,
      });

      let iconSrc = 'assets/aws/weather.svg';
      if (buoy.name === 'ECFS_Ship') {
        iconSrc = 'assets/Sagar_Nidhi.png';
      }

      iconFeature.setStyle(
        new Style({
          image: new Icon({
            // src: 'assets/aws/aws1.svg',
            src: iconSrc,
            scale: 0.2,
          }),
          text: new Text({
            // text: buoy.name,
            font: '12px Arial, sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
            offsetY: -20,
          }),
        })
      );

      vectorSource.addFeature(iconFeature);
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          }),
        }),
        this.vectorLayer,
      ],
      view: new View({
        center: fromLonLat([80.482814, 13.031254]),
        zoom: 6,
      }),
    });

    this.map.on('click', (event) => {
      const feature = this.map.forEachFeatureAtPixel(
        event.pixel,
        (feat) => feat
      );

      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        this.popupContent = `<strong>${feature.get(
          'name'
        )}</strong><br>${feature.get('description')}`;

        if (!this.overlay) {
          this.overlay = new Overlay({
            element: this.popupContainer.nativeElement,
            positioning: 'bottom-center',
            stopEvent: false,
          });
          this.map.addOverlay(this.overlay);
        }

        this.overlay.setPosition(coordinates);
        this.cdRef.detectChanges();
      } else {
        if (this.overlay) {
          this.overlay.setPosition(undefined);
        }
      }
    });
  }
}
