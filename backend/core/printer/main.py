from escpos.printer import Network, Dummy
# from escpos.exceptions import DeviceNotFoundError <- compatibile solo con versioni maggiori di 3.0.0
from datetime import datetime
import os
import pytz

day_names = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
month_names = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]

class Printer():

    def __init__(self, ip) -> None:

        try:
            self.printer_network = Network(ip, timeout=2)
            # Test connection
            self.printer_network.open()
            self.printer_network.close()
        # except DeviceNotFoundError:
        except Exception:
            raise Exception("Printer not found")

        self.logo_image = os.path.join(os.path.dirname(__file__), "../images/palm_beach_400.png")

        self.tz = pytz.timezone('Europe/Rome')

    def print_subscription(self, umbrella_code, sunbeds, code, start_date, end_date, subscription_type, custom_period):

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # TITLE
        dummy.set(align='center', text_type="B", width=2, height=2)
        dummy.text(f"\nAbbonamento #{code}")
    
        #BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n\n")

        if umbrella_code:
            dummy.text(f"\nOmbrellone: #{umbrella_code}\n")

        dummy.text(f"\nLettini: {sunbeds}\n")

        if subscription_type in ["P", "S"]:
            start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_date_dt =datetime.strptime(end_date, '%Y-%m-%d')

            dummy.text(f"\nData di inizio: {start_date_dt.strftime('%d/%m/%Y')}\n")
            dummy.text(f"\nData di fine: {end_date_dt.strftime('%d/%m/%Y')}\n")
        else:
            val_days, val_months = self.get_validity_for_custom_period(custom_period)
            dummy.text(f"\nValido il {val_days}\n{val_months}")

        # DATETIME
        now = datetime.now(self.tz)
        dt_string = now.strftime("%H:%M %d/%m/%Y")
        dummy.text(f"\n\n{dt_string}\n\n")

        # FOOTER
        dummy.set(align='center', text_type="B", width=1, height=2)
        dummy.text('** grazie e arrivederci **')

        dummy.cut()

        self.printer_network._raw(dummy.output)

    def get_validity_for_custom_period(self, custom_period):

        val_days = ""
        val_months = ""

        days = custom_period.split("-")[0].split(",")
        months = custom_period.split("-")[1].split(",")

        for count, item in enumerate(days):
            val_days += day_names[int(days[count])]
            if (count != (len(days) - 1)):
                val_days += ", "

        if len(months) > 1:
            val_months += " nei mesi di "
        else:
            val_months += " nel mese di "

        for count, item in enumerate(months):
            val_months += month_names[int(months[count])]
            if (count != (len(months) - 1)):
                val_months += ", "

        return val_days, val_months

    def print_reservation(self, ticket_id, umbrella_code, sunbeds):

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # TITLE
        dummy.set(align='center', text_type="B", width=2, height=2)
        dummy.text(f"Ticket #{ticket_id}")

        #BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n")

        if umbrella_code:
            dummy.text(f"\nOmbrellone: #{umbrella_code}\n")

        dummy.text(f"\nLettini: {sunbeds}\n")

        # DATETIME
        now = datetime.now()
        dt_string = now.strftime("%H:%M %d/%m/%Y")
        dummy.text(f"\n\n{dt_string}\n\n")

        # FOOTER
        dummy.set(align='center', text_type="B", width=1, height=2)
        dummy.text('** grazie e arrivederci **')

        dummy.cut()

        self.printer_network._raw(dummy.output)

    def is_online(self):
        return self.printer_network.is_online()
    
    def paper_status(self):
        return self.printer_network.paper_status()