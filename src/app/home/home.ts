import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Shell } from '../shell/shell';

@Component({
  selector: 'app-home',
  imports: [Shell, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
