import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Worker} from './worker'
import { WorkerRules } from './worker-rules';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  
  constructor(private http: HttpClient) { }

  clearForm() {
    $('.form-control').val('')
  };

  getWorker() {
    return this.http.get<Worker[]>('http://localhost/accounting/list.php');
  }

  creatEmployee(employee: Worker) {
    return this.http.post('http://localhost/accounting/postEmployee.php', employee)
  }

  deleteWorkerSer(id: number) {
    return this.http.delete<Worker[]>('http://localhost/accounting/deleteEmployee.php?id=' + id)
  }

  updateWorkerSer(employee: Worker) {
    return this.http.put('http://localhost/accounting/updateEmployee.php?id=' + employee.workerId, employee )
  }

  updateWorkerRulesSer(workerRules: WorkerRules) {
    return this.http.put('http://localhost/accounting/editWorkerRules.php?id=1', workerRules )
  }

  getWorkerRules() {
    return this.http.get<WorkerRules[]>('http://localhost/accounting/workerRulesList.php');
  }

}
