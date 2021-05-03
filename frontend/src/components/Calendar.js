import React, { Component, useState } from "react";
import { format, subHours, startOfMonth } from 'date-fns';
import {
  MonthlyBody,
  MonthlyDay,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
} from '@zach.codes/react-calendar';
import { FaCalendar } from "react-icons/fa";

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMonth: startOfMonth(new Date())
        };
      }

    setCurrentMonth = (date) => {
        this.currentMonth = date
    }

    render() {
        return (
            <MonthlyCalendar
                currentMonth={this.currentMonth}
                onCurrentMonthChange={date => this.setCurrentMonth(date)}
                >
                <MonthlyNav />
                <MonthlyBody
                    // events={[
                    //     { title: 'Call John', date: subHours(new Date(), 2) },
                    //     { title: 'Call John', date: subHours(new Date(), 1) },
                    //     { title: 'Meeting with Bob', date: new Date() },
                    // ]}
                >
                <MonthlyDay EventType
                    renderDay={data =>
                        data.map((item, index) => (
                            <DefaultMonthlyEventItem
                                key={index}
                                title={item.title}
                                // Format the date here to be in the format you prefer
                                date={format(item.date, 'k:mm')}
                            />
                        ))
                    }
                />
                </MonthlyBody>
            </MonthlyCalendar>
        );
    }
};

export default Calendar;