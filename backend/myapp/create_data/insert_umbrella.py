#!/usr/bin/env python
import os
import sys
import requests
from datetime import timedelta, date, datetime

def main():

    url = 'http://localhost:8000/api/umbrellas/'    

    # for i in range(1, 121):

    #     myobj = {'code': i, 
    #             'description': "", 
    #             'row': 0, 
    #     }
        
    #     x = requests.post(url, data = myobj)
    #     print(x.text)

    i = 1

    for row in range(1, 12):

        for col in range(0, 13):

            if row in [9,10,11] and col == 0:
                myobj = {
                    'code': None, 
                    'description': "", 
                    'row': row, 
                    'col': col
                }
                continue

            if row in [8,9,10,11] and (col == 4 or col == 5):
                myobj = {
                    'code': None, 
                    'description': "", 
                    'row': row, 
                    'col': col
                }
                continue

            if row in [10,11] and col in [6,7,8]:
                myobj = {
                    'code': None, 
                    'description': "", 
                    'row': row, 
                    'col': col
                }
                continue

            if row in [10,11] and col in [9,10]:
                myobj = {
                    'code': None, 
                    'description': "", 
                    'row': row, 
                    'col': col
                }
                continue

            myobj = {
                'code': i, 
                'description': "", 
                'row': row, 
                'col': col
            }
            
            print(myobj)

            # x = requests.post(url, data = myobj)
            # print(x.text)

            i += 1
            if i == 103:
                i += 1


if __name__ == '__main__':
    main()
