#!/usr/bin/env python
import os
import sys
import requests
from datetime import timedelta, date, datetime

def main():

    url = 'http://localhost:8000/api/umbrellas/'    

    total_rows = 6
    total_columns = 13

    first_group = 1

    for row in range(0, total_rows):

        for col in range(0, total_columns):

            myobj = {
                'code': (total_columns*(row+1))-col, 
                'description': "", 
                'sunbeds': 2,
                'row': row, 
                'column': col
            }
            
            print(myobj)
            x = requests.post(url, data = myobj)

            first_group += 1

    last_rows = 2
    last_columns = 6

    for row in range(0, last_rows):

        index = first_group + (row+1)*last_columns
        for col in range(0, last_columns):

            myobj = {
                'code': index, 
                'description': "", 
                'sunbeds': 2,
                'row': row + total_rows + 1, 
                'column': col
            }
            
            print(myobj)
            x = requests.post(url, data = myobj)

            index -= 1

if __name__ == '__main__':
    main()
