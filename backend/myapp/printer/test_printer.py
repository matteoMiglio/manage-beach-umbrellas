from escpos.printer import Network, Dummy
from datetime import datetime
import os
import pytz

ip = "192.168.1.100"
printer_network = Network(ip)

dummy = Dummy()

# LOGO
dummy.set(align='center', width=1, height=1)
dummy.text("\nPROVA PROVA\n")

dummy.cut()

printer_network._raw(dummy.output)