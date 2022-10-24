import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

@Component({
    selector: 'app-rmt-treeview',
    templateUrl: './rmt-treeview.component.html',
    styleUrls: ['./rmt-treeview.component.scss']
})
export class RmtTreeviewComponent implements OnInit {
    
    @Input() type: string = ""; //tree type
    @Input() title: string = "";
    @Input() data: any = [];
    @Input() checked: any = [];
    @Input() expands: any = [];
    
    @Output() treeActionEvent = new EventEmitter<Object>()
    @Output() treeChangeEvent = new EventEmitter<Object>()

    constructor() {
    }

    ngOnInit(): void {
    }

    nzEvent(event: NzFormatEmitEvent): void {
        this.treeChangeEvent.emit({
            type: this.type,
            event
        })
    }

    treeActions(actionType: string) {
        this.treeActionEvent.emit({ type: this.type, actionType })
    }
}
