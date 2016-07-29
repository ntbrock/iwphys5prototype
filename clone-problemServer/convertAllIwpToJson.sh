#!/bin/bash


urlencode() {
    # urlencode <string>
    old_lc_collate=$LC_COLLATE
    LC_COLLATE=C
    
    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done
    
    LC_COLLATE=$old_lc_collate
}



FOUND_FILE=foundIwpFiles.list
find . -type f|grep [.]iwp\$ > $FOUND_FILE

# Pre-clean json files
find . -name *.json -exec rm -f {} \;

while read IWP_FILE; do
  echo $IWP_FILE
  JSON_FILE=`echo "$IWP_FILE" | sed -e 's/iwp/json/g'`
  echo $JSON_FILE

  #URL_FILE=`urlencode $IWP_FILE`
  #echo $URL_FILE

  curl "https://www.iwphys.org/TEST_2016Jun10/xtoj.php/$IWP_FILE" > "$JSON_FILE"

done <$FOUND_FILE



