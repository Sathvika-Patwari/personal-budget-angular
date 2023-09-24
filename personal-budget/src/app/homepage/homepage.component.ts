import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements AfterViewInit {
  selectedItem: string = '';

@Output() itemSelected: EventEmitter<string> = new EventEmitter<string>();

onItemClick(item: string) {
  this.selectedItem = item;
  this.itemSelected.emit(item);
}

  public dataSource: any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#000fff',
          '#ff90ff',
          '#tiger3',
        ],
      },
    ],
    labels: [],
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.fetchDataIfNeeded();
  }

  ngAfterViewInit(): void {
    this.dataService.getData().subscribe((data: any) => {
      this.createD3DonutChart(data);
      for (var i = 0; i < data.length; i++) {
        this.dataSource.datasets[0].data[i] = data[i].budget;
        this.dataSource.labels[i] = data[i].title;
      }
      this.createChart(data);
    });
  }

  createChart(data: any): void {
      var ctx = document.getElementById('myChart') as HTMLCanvasElement;
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
      }
);
}

  createD3DonutChart(data: any): void {
    const width = 650;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select("#donut")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const pie = d3.pie()
      .value((d: any) => d.budget);

    const pieData = pie(data);

    const arcs = svg.selectAll("arc")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", (d: any) => arc(d))
      .attr("fill", (d: any) => color(d.data.title));

    svg.selectAll('allSlices')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', (d: any) => arc(d))
      .attr('fill', (d: any) => color(d.data.title))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg.selectAll('allPolylines')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr('points', (d: any): any => {
        const posA = arc.centroid(d);
        const posB = outerArc.centroid(d);
        const posC = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

    svg.selectAll('allLabels')
      .data(pieData)
      .enter()
      .append('text')
      .text((d: any) : any=>  d.data.title+" "+"("+d.data.budget+")")
      .attr('transform', (d: any) => {
        const pos = outerArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', (d: any) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });
  }
  }
