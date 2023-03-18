from escpos.printer import Network, Dummy
from datetime import datetime
import os
import pytz

class Printer():

    def __init__(self) -> None:

        ip = "192.168.1.100"
        self.printer_network = Network(ip)
        self.logo_image = os.path.join(os.path.dirname(__file__), "./images/Logo_512.png")
        self.tz = pytz.timezone('Europe/Rome')

    def print_subscription(self, umbrella_number, sunbeds, code, start_date, end_date):

        start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_date_dt =datetime.strptime(end_date, '%Y-%m-%d')

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # TITLE
        dummy.set(align='center', text_type="B", width=2, height=2)
        dummy.text(f"\nAbbonamento #{code}")
    
        #BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n\n")

        if umbrella_number != None:
            dummy.text(f"\nOmbrellone: #{umbrella_number}\n")

        dummy.text(f"\nLettini: {sunbeds}\n")
        dummy.text(f"\nData di inizio: {start_date_dt.strftime('%d/%m/%Y')}\n")
        dummy.text(f"\nData di fine: {end_date_dt.strftime('%d/%m/%Y')}\n")

        # DATETIME
        now = datetime.now(self.tz)
        dt_string = now.strftime("%H:%M %d/%m/%Y")
        dummy.text(f"\n\n{dt_string}\n\n")

        # FOOTER
        dummy.set(align='center', text_type="B", width=1, height=2)
        dummy.text('** grazie e arrivederci **')

        dummy.cut()

        self.printer_network._raw(dummy.output)

    def print_reservation(self, umbrella_number, sunbeds):

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n\n")

        if umbrella_number != None:
            dummy.text(f"\nOmbrellone: #{umbrella_number}\n")

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
