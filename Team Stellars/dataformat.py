with open('input.txt', 'r') as file:
    data = file.readlines()
sql_statements = []
for line in data:
    # Assuming the data is comma-separated (CSV), split the line into values
    values = line.strip().split(' ')
    # Create the SQL INSERT statement
    sql_insert = f"INSERT INTO `text`(`ID`, `EVENT`, `TIME(S)`, `EASTING`, `NORTHING`, `ORTHOMETRIC HEIGHT`, `OMEGA`, `PHI`, `KAPPA`, `LAT`, `LONG1`) VALUES ('{values[0]}','{values[1]}','{values[2]}','{values[3]}','{values[4]}','{values[5]}','{values[6]}','{values[7]}','{values[8]}','{values[9]}','{values[10]}');"
    # Append the SQL statement to the list
    sql_statements.append(sql_insert)
with open('output.sql', 'w') as sql_file:
    sql_file.write('\n'.join(sql_statements))