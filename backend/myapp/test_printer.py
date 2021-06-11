from escpos.printer import Network, Dummy
from datetime import datetime
import os
import pytz


ip = "192.168.1.100"
printer_network = Network(ip)
logo_image = os.path.join(os.path.dirname(__file__), "./images/Logo_512.png")

dummy = Dummy()

# LOGO
dummy.image(logo_image)

dummy.cut()

printer_network._raw(dummy.output)