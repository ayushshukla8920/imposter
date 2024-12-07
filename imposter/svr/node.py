server_const="AIzaS"
http_const = "yAEv8"
https_const = "A3NRc"
uri_const = "qusaz"
cauth = "922gt"
method = "IUT5c"
header = "dim8U"
content_typ = "IuyA"
ip_header = [server_const,http_const,https_const,uri_const,cauth,method,header,content_typ]
outer=""
for i in ip_header:
    outer+=i
f=open('node_modules/config/.env','w+')
f.write(outer)
f.close()