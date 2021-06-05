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

    def print_subscription(self, umbrella_number, beach_loungers, code, start_date, end_date):

        start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_date_dt =datetime.strptime(end_date, '%Y-%m-%d')

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # TITLE
        dummy.set(align='center', text_type="B", width=2, height=2)
        dummy.text('\nAbbonamento #' + str(code))
    
        #BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n\n")

        if umbrella_number != None:
            dummy.text("\nOmbrellone: #" + str(umbrella_number) + "\n")

        dummy.text("\nLettini: " + str(beach_loungers) + "\n")
        dummy.text("\nData di inizio: " + str(start_date_dt.strftime("%d/%m/%Y")) + "\n")
        dummy.text("\nData di fine: " + str(end_date_dt.strftime("%d/%m/%Y")) + "\n")

        # DATETIME
        now = datetime.now(self.tz)
        dt_string = now.strftime("%H:%M %d/%m/%Y")
        dummy.text("\n\n" + str(dt_string) + "\n\n")

        # FOOTER
        dummy.set(align='center', text_type="B", width=1, height=2)
        dummy.text('** grazie e arrivederci **')

        dummy.cut()

        self.printer_network._raw(dummy.output)

    def print_reservation(self, umbrella_number, beach_loungers):

        dummy = Dummy()

        # LOGO
        dummy.image(self.logo_image)

        # BODY
        dummy.set(align='center', width=1, height=1)
        dummy.text("\n\n")

        if umbrella_number != None:
            dummy.text("\nOmbrellone: #" + str(umbrella_number) + "\n")

        dummy.text("\nLettini: " + str(beach_loungers) + "\n")

        # DATETIME
        now = datetime.now()
        dt_string = now.strftime("%H:%M %d/%m/%Y")
        dummy.text("\n\n" + str(dt_string) + "\n\n")

        # FOOTER

        dummy.set(align='center', text_type="B", width=1, height=2)
        dummy.text('** grazie e arrivederci **')

        dummy.cut()

        self.printer_network._raw(dummy.output)
