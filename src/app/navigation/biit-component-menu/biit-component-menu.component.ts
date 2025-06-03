import {Component, OnInit, TemplateRef} from '@angular/core';
import {TemplateService} from "../../services/template.service";

@Component({
  selector: 'biit-component-menu',
  templateUrl: './biit-component-menu.component.html',
  styleUrls: ['./biit-component-menu.component.scss']
})
export class BiitComponentMenuComponent implements OnInit{
  template: TemplateRef<any> | null = null;

  constructor(private templateService: TemplateService) { }

  ngOnInit() {
    this.templateService.currentTemplate.subscribe(template => this.template = template);
  }
}
