import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Boozle';

  search(searchText: String){
    console.log(searchText);
  }
}
