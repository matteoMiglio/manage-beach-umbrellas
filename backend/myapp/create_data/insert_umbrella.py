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


    # prima fila custom
    j = 0
    for col in range(0, 13):
        if col == 0:
            myobj = {
                'code': "1B", 
                'description': "", 
                'beachLoungers': 2,
                'row': j, 
                'col': col
            }
            x = requests.post(url, data = myobj)
            print(x.text)
            # print(myobj)
            continue
        else:
            if col == 1:
                myobj = {
                    'code': "2B", 
                    'description': "", 
                    'beachLoungers': 2,
                    'row': j, 
                    'col': col
                }
                x = requests.post(url, data = myobj)
                print(x.text)
                # print(myobj)
                continue                
            else:
                if col == 11:
                    myobj = {
                        'code': "12B", 
                        'description': "", 
                        'beachLoungers': 2,
                        'row': j, 
                        'col': col
                    }
                    x = requests.post(url, data = myobj)
                    print(x.text)
                    # print(myobj)
                    continue                    
                else:
                    if col == 12:
                        myobj = {
                            'code': "13B", 
                            'description': "", 
                            'beachLoungers': 2,
                            'row': j, 
                            'col': col
                        }
                        x = requests.post(url, data = myobj)
                        print(x.text)
                        # print(myobj)
                        continue
                        
        myobj = {
            'code': "", 
            'description': "",
            'beachLoungers': 0, 
            'row': j, 
            'col': col
        }

        x = requests.post(url, data = myobj)
        print(x.text)
        
        # print(myobj)


    i = 1

    for row in range(1, 12):

        for col in range(0, 13):

            if row in [9,10,11] and col == 0:
                myobj = {
                    'code': "", 
                    'description': "", 
                    'beachLoungers': 0,
                    'row': row, 
                    'col': col
                }
                x = requests.post(url, data = myobj)
                print(x.text)
                continue

            if row in [8,9,10,11] and (col == 4 or col == 5):
                myobj = {
                    'code': "", 
                    'description': "", 
                    'beachLoungers': 0,
                    'row': row, 
                    'col': col
                }
                x = requests.post(url, data = myobj)
                print(x.text)
                continue

            if row in [10,11] and col in [6,7,8]:
                myobj = {
                    'code': "", 
                    'description': "", 
                    'beachLoungers': 0,
                    'row': row, 
                    'col': col
                }
                x = requests.post(url, data = myobj)
                print(x.text)
                continue

            if row == 11 and col in [9,10]:
                myobj = {
                    'code': "", 
                    'description': "", 
                    'beachLoungers': 0,
                    'row': row, 
                    'col': col
                }
                x = requests.post(url, data = myobj)
                print(x.text)
                continue

            myobj = {
                'code': i, 
                'description': "", 
                'beachLoungers': 2,
                'row': row, 
                'col': col
            }
            
            # print(myobj)

            x = requests.post(url, data = myobj)
            print(x.text)

            i += 1
            if i == 103:
                i += 1


if __name__ == '__main__':
    main()
