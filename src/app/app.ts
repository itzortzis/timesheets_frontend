import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from './services/api';

interface MonthInfo {
  day: number;
  holiday: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  hours_related_issue = false;
  wps_related_issue = false;
  weights_related_issue = false;
  month_related_issue = false;
  period_start = 1;
  period_end = 1;
  maxVal = 10
  hours = '';
  currentTotalWeight = 0;
  currentMonthInfo: MonthInfo[] = [];
  currentMonthName = '';
  currentMonthId = 'test';
  currentMaxDays = 30;
  globalError = 'Οι ώρες δεν έχουν προστεθεί σωστά.';
  response_related_issue = true;
  response_issue = "";

  months = [
    {
      "month_gr": "Ιανουάριος",
      "number": 1,
      "month_gr1": "Ιανουαρίου",
      "month_en": "January",
      "days": 31,
      "holidays_or_weekends": [1,4,5,6,11,12,18,19,25,26]
    },
    {
      "month_gr": "Φεβρουάριος",
      "number": 2,
      "month_gr1": "Φεβρουαρίου",
      "month_en": "February",
      "days": 28,
      "holidays_or_weekends": [1,2,8,9,15,16,22,23]
    },
    {
      "month_gr": "Μάρτιος",
      "number": 3,
      "month_gr1": "Μαρτίου",
      "month_en": "March",
      "days": 31,
      "holidays_or_weekends": [1,2,3,8,9,15,16,22,23,25,29,30]
    },
    {
      "month_gr": "Απρίλιος",
      "number": 4,
      "month_gr1": "Απριλίου",
      "month_en": "April",
      "days": 30,
      "holidays_or_weekends": [5,6,12,13,18,19,20,21,26,27]
    },
    {
      "month_gr": "Μάιος",
      "number": 5,
      "month_gr1": "Μαΐου",
      "month_en": "May",
      "days": 31,
      "holidays_or_weekends": [3,4,10,11,17,18,24,25,31]
    },
    {
      "month_gr": "Ιούνιος",
      "number": 6,
      "month_gr1": "Ιουνίου",
      "month_en": "June",
      "days": 30,
      "holidays_or_weekends": [1,7,8,9,14,15,21,22,28,29]
    },
    {
      "month_gr": "Ιούλιος",
      "number": 7,
      "month_gr1": "Ιουλίου",
      "month_en": "July",
      "days": 31,
      "holidays_or_weekends": [5,6,12,13,19,20,26,27]
    },
    {
      "month_gr": "Αύγουστος",
      "number": 8,
      "month_gr1": "Αυγούστου",
      "month_en": "August",
      "days": 31,
      "holidays_or_weekends": [2,3,9,10,16,17,23,24,30,31,15]
    },
    {
      "month_gr": "Σεπτέμβριος",
      "number": 9,
      "month_gr1": "Σεπτεμβρίου",
      "month_en": "September",
      "days": 30,
      "holidays_or_weekends": [6,7,13,14,20,21,27,28]
    },
    {
      "month_gr": "Οκτώβριος",
      "number": 10,
      "month_gr1": "Οκτωβρίου",
      "month_en": "October",
      "days": 31,
      "holidays_or_weekends": [4,5,11,12,18,19,25,26,28]
    },
    {
      "month_gr": "Νοέμβριος",
      "number": 11,
      "month_gr1": "Νοεμβρίου",
      "month_en": "November",
      "days": 30,
      "holidays_or_weekends": [1,2,8,9,15,16,22,23,29,30]
    },
    {
      "month_gr": "Δεκέμβριος",
      "number": 12,
      "month_gr1": "Δεκεμβρίου",
      "month_en": "December",
      "days": 31,
      "holidays_or_weekends": [6,7,13,14,20,21,25,26,27,28]
    }
  ];


  wps = [
    {
      "name": 'WP1',
      "weight": 0,
      "max": 10,
      "enabled": false
    },
    {
      "name": 'WP2',
      "weight": 0,
      "max": 10,
      "enabled": false
    },
    {
      "name": 'WP3',
      "weight": 0,
      "max": 10,
      "enabled": false
    },
    {
      "name": 'WP4',
      "weight": 0,
      "max": 10,
      "enabled": false
    },
    {
      "name": 'WP5',
      "weight": 0,
      "max": 10,
      "enabled": false
    },
    {
      "name": 'WP6',
      "weight": 0,
      "max": 10,
      "enabled": false
    }
  ];

  constructor(private apiService: Api) {}


  handleMonthSelection(event: Event): void {
    this.currentMonthInfo = [];
    const selectedValue = (event.target as HTMLSelectElement).value;
    const currentMonth = this.months.filter(month => month.month_en.includes(selectedValue));
    this.currentMonthName = currentMonth[0].month_gr1;
    this.currentMonthId = currentMonth[0].month_en;
    this.currentMaxDays = currentMonth[0].days;
    var holiday;
    for (let i = 1; i < currentMonth[0].days+1; i++) {
      if (currentMonth[0].holidays_or_weekends.includes(i)) {
        holiday = true
      } else {
        holiday = false
      }
      this.currentMonthInfo.push({
        "day": i,
        "holiday": holiday
      });
    }
  }

  private readonly MAX_TOTAL_WEIGHT = 100;

  limitWeight(event: Event, currentItem: any): void {
    const activeWeights = this.wps.filter(item => item.enabled);
    const inputElement = event.target as HTMLInputElement;
    const rawWeight = parseFloat(inputElement.value);

    currentItem.weight = rawWeight;

    const currentTotal = activeWeights.reduce((sum, item) => sum + item.weight, 0);


    if (currentTotal > this.MAX_TOTAL_WEIGHT) {
      const sumOfOthers = currentTotal - currentItem.weight;
      const maxAllowedForCurrent = this.MAX_TOTAL_WEIGHT - sumOfOthers;

      currentItem.weight = maxAllowedForCurrent;
      inputElement.value = String(maxAllowedForCurrent);
    }
  }

  getRemainingBudget(): number {
    const currentTotal = this.wps.reduce((sum, item) => sum + item.weight, 0);
    return currentTotal;
  }


  toggleWeightState(item: any): void {
    if (!item.enabled) {
        item.weight = 0;
    } 
    
  } 

  collectInfo() {
    const currentMonth = this.months.filter(month => month.month_en.includes(this.currentMonthId));
    var holidays: number[] = [];
    var wps_names: string[] = [];
    var wps_weights: number[] = [];
    var foundMonth = -1;

    if (currentMonth.length != 0) {
      foundMonth = currentMonth[0].number;
      this.month_related_issue = false;
    } else {
      this.month_related_issue = true;
    }

    this.currentMonthInfo.forEach(elem => {
      if (elem.holiday) {
        holidays.push(elem.day);
      }
    });

    this.wps.forEach(elem => {
      if (elem.weight > 0) {
        wps_names.push(elem.name);
      }
    });

    this.wps.forEach(elem => {
      if (elem.weight > 0) {
        wps_weights.push(elem.weight);
      }
    });

    
    if (Number.isNaN(parseInt(this.hours))) {
      this.hours_related_issue = true;
    } else {
      this.hours_related_issue = false;
    }

    if (wps_names.length < 1) {
      this.wps_related_issue = true;
    } else {
      this.wps_related_issue = false;
    }

    const currentSumOfWeights = this.wps.reduce((sum, item) => sum + item.weight, 0);
    if (currentSumOfWeights < 100) {
      this.weights_related_issue = true;
    } else {
      this.weights_related_issue = false;
    }

    var info = {
      "hours": parseInt(this.hours),
      "month": foundMonth,
      "holidays": holidays,
      "period_start": this.period_start,
      "period_end": this.period_end,
      "wps_names": wps_names,
      "wps_weights": wps_weights,
      "year": 2025
    };

    var mes = "";
    console.log(info);
    this.apiService.postJsonData(
      'http://melina.ispatial.survey.ntua.gr:8201/process',
      info).subscribe({
        next: (response) => {
          console.log(response.filepath);
          if (response.status == "success") {
            this.response_related_issue = false;
            this.downoladCSV(response.filepath);
            mes = "Επιτυχία! Επιλέξτε 'ΟΚ' για να κατεβάσετε το αρχείο σας.";
          } else {
            this.response_related_issue = true;
            mes = "Αποτυχία!" + " " + "Ελέγξτε τις ώρες και το διάστημα";
          }
          
          alert(mes);
          this.response_issue = response.message;
          
          console.log('Post successful!', response);
        },
        error: (error) => {
          console.error('POST error:', error);
          // this.responseMessage = null; 
        }
      });

    
  
    
  }



  downoladCSV(filepath: string) {
    const info = {
      "filepath": filepath
    }
    this.apiService.downloadCsv(
        'http://melina.ispatial.survey.ntua.gr:8201/download', 
        info
      ).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.style.display = 'none';
          document.body.appendChild(a);
          
          a.href = url;
          a.download = `report.csv`; 

          a.click();
          
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error: (err) => {
          console.error('Error during CSV download:', err);
        }
      });
  }

  
}
