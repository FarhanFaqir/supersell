const httpStatus = require("http-status");
const Country = require("../../models/country");
const { checkAccess, paginationParams } = require("../../utils/common");
const { sendResponse } = require("../../utils/response");
const { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = httpStatus;

const addCountry = async (req, res) => {
    try {
        const countries = [
            {
              "countryName": "Afghanistan",
              "countryShortName": "AF",
              "timezone": "Asia/Kabul",
              "offset": "+04:30"
            },
            {
              "countryName": "Albania",
              "countryShortName": "AL",
              "timezone": "Europe/Tirane",
              "offset": "+02:00"
            },
            {
              "countryName": "Algeria",
              "countryShortName": "DZ",
              "timezone": "Africa/Algiers",
              "offset": "+01:00"
            },
            {
              "countryName": "American Samoa",
              "countryShortName": "AS",
              "timezone": "Pacific/Pago_Pago",
              "offset": "-11:00"
            },
            {
              "countryName": "Andorra",
              "countryShortName": "AD",
              "timezone": "Europe/Andorra",
              "offset": "+02:00"
            },
            {
              "countryName": "Angola",
              "countryShortName": "AO",
              "timezone": "Africa/Luanda",
              "offset": "+01:00"
            },
            {
              "countryName": "Anguilla",
              "countryShortName": "AI",
              "timezone": "America/Anguilla",
              "offset": "-04:00"
            },
            {
              "countryName": "Antarctica",
              "countryShortName": "AQ",
              "timezone": "Antarctica/Casey",
              "offset": "+08:00"
            },
            {
              "countryName": "Antigua and Barbuda",
              "countryShortName": "AG",
              "timezone": "America/Antigua",
              "offset": "-04:00"
            },
            {
              "countryName": "Argentina",
              "countryShortName": "AR",
              "timezone": "America/Argentina/Buenos_Aires",
              "offset": "-03:00"
            },
            {
              "countryName": "Armenia",
              "countryShortName": "AM",
              "timezone": "Asia/Yerevan",
              "offset": "+04:00"
            },
            {
              "countryName": "Aruba",
              "countryShortName": "AW",
              "timezone": "America/Aruba",
              "offset": "-04:00"
            },
            {
              "countryName": "Australia",
              "countryShortName": "AU",
              "timezone": "Australia/Sydney",
              "offset": "+11:00"
            },
            {
              "countryName": "Austria",
              "countryShortName": "AT",
              "timezone": "Europe/Vienna",
              "offset": "+02:00"
            },
            {
              "countryName": "Azerbaijan",
              "countryShortName": "AZ",
              "timezone": "Asia/Baku",
              "offset": "+04:00"
            },
            {
              "countryName": "Bahamas",
              "countryShortName": "BS",
              "timezone": "America/Nassau",
              "offset": "-04:00"
            },
            {
              "countryName": "Bahrain",
              "countryShortName": "BH",
              "timezone": "Asia/Bahrain",
              "offset": "+03:00"
            },
            {
              "countryName": "Bangladesh",
              "countryShortName": "BD",
              "timezone": "Asia/Dhaka",
              "offset": "+06:00"
            },
            {
                "countryName": "Barbados",
                "countryShortName": "BB",
                "timezone": "Asia/Dhaka",
                "offset": "+06:00"
              },
              {
                "countryName": "Belarus",
                "countryShortName": "BY",
                "timezone": "Europe/Minsk",
                "offset": "+03:00"
              },
              {
                "countryName": "Belgium",
                "countryShortName": "BE",
                "timezone": "Europe/Brussels",
                "offset": "+02:00"
              },
              {
                "countryName": "Belize",
                "countryShortName": "BZ",
                "timezone": "America/Belize",
                "offset": "-06:00"
              },
              {
                "countryName": "Benin",
                "countryShortName": "BJ",
                "timezone": "Africa/Porto-Novo",
                "offset": "+01:00"
              },
              {
                "countryName": "Bermuda",
                "countryShortName": "BM",
                "timezone": "Atlantic/Bermuda",
                "offset": "-03:00"
              },
              {
                "countryName": "Bhutan",
                "countryShortName": "BT",
                "timezone": "Asia/Thimphu",
                "offset": "+06:00"
              },
              {
                "countryName": "Bolivia (Plurinational State of)",
                "countryShortName": "BO",
                "timezone": "America/La_Paz",
                "offset": "-04:00"
              },
              {
                "countryName": "Bonaire, Sint Eustatius and Saba",
                "countryShortName": "BQ",
                "timezone": "America/Kralendijk",
                "offset": "-04:00"
              },
              {
                "countryName": "Bosnia and Herzegovina",
                "countryShortName": "BA",
                "timezone": "Europe/Sarajevo",
                "offset": "+02:00"
              },
              {
                "countryName": "Botswana",
                "countryShortName": "BW",
                "timezone": "Africa/Gaborone",
                "offset": "+02:00"
              },
              {
                "countryName": "Bouvet Island",
                "countryShortName": "BV",
                "timezone": "Antarctica/Troll",
                "offset": "+01:00"
              },
              {
                "countryName": "Brazil",
                "countryShortName": "BR",
                "timezone": "America/Sao_Paulo",
                "offset": "-03:00"
              },
              {
                "countryName": "British Indian Ocean Territory",
                "countryShortName": "IO",
                "timezone": "Indian/Chagos",
                "offset": "+06:00"
              },
              {
                "countryName": "Brunei Darussalam",
                "countryShortName": "BN",
                "timezone": "Asia/Brunei",
                "offset": "+08:00"
              },
              {
                "countryName": "Bulgaria",
                "countryShortName": "BG",
                "timezone": "Europe/Sofia",
                "offset": "+03:00"
              },
              {
                "countryName": "Burkina Faso",
                "countryShortName": "BF",
                "timezone": "Africa/Ouagadougou",
                "offset": "+00:00"
              },
              {
                "countryName": "Burundi",
                "countryShortName": "BI",
                "timezone": "Africa/Bujumbura",
                "offset": "+02:00"
              },{
                "countryName": "Cabo Verde",
                "countryShortName": "CV",
                "timezone": "Atlantic/Cape_Verde",
                "offset": "-01:00"
              },
              {
                "countryName": "Cambodia",
                "countryShortName": "KH",
                "timezone": "Asia/Phnom_Penh",
                "offset": "+07:00"
              },
              {
                "countryName": "Cameroon",
                "countryShortName": "CM",
                "timezone": "Africa/Douala",
                "offset": "+01:00"
              },
              {
                "countryName": "Canada",
                "countryShortName": "CA",
                "timezone": "America/Toronto",
                "offset": "-04:00"
              },
              {
                "countryName": "Cayman Islands",
                "countryShortName": "KY",
                "timezone": "America/Cayman",
                "offset": "-05:00"
              },
              {
                "countryName": "Central African Republic",
                "countryShortName": "CF",
                "timezone": "Africa/Bangui",
                "offset": "+01:00"
              },
              {
                "countryName": "Chad",
                "countryShortName": "TD",
                "timezone": "Africa/Ndjamena",
                "offset": "+01:00"
              },
              {
                "countryName": "Chile",
                "countryShortName": "CL",
                "timezone": "America/Santiago",
                "offset": "-03:00"
              },
              {
                "countryName": "China",
                "countryShortName": "CN",
                "timezone": "Asia/Shanghai",
                "offset": "+08:00"
              },
              {
                "countryName": "Christmas Island",
                "countryShortName": "CX",
                "timezone": "Indian/Christmas",
                "offset": "+07:00"
              },
              {
                "countryName": "Cocos (Keeling) Islands",
                "countryShortName": "CC",
                "timezone": "Indian/Cocos",
                "offset": "+06:30"
              },
              {
                "countryName": "Colombia",
                "countryShortName": "CO",
                "timezone": "America/Bogota",
                "offset": "-05:00"
              },
              {
                "countryName": "Comoros",
                "countryShortName": "KM",
                "timezone": "Africa/Nairobi",
                "offset": "+03:00"
              },
              {
                "countryName": "Congo",
                "countryShortName": "CG",
                "timezone": "Africa/Brazzaville",
                "offset": "+01:00"
              },
              {
                "countryName": "Congo, Democratic Republic of the",
                "countryShortName": "CD",
                "timezone": "Africa/Kinshasa",
                "offset": "+01:00"
              },
              {
                "countryName": "Cook Islands",
                "countryShortName": "CK",
                "timezone": "Pacific/Rarotonga",
                "offset": "-10:00"
              },
              {
                "countryName": "Costa Rica",
                "countryShortName": "CR",
                "timezone": "America/Costa_Rica",
                "offset": "-06:00"
              },
              {
                "countryName": "Croatia",
                "countryShortName": "HR",
                "timezone": "Europe/Zagreb",
                "offset": "+02:00"
              },
              {
                "countryName": "Cuba",
                "countryShortName": "CU",
                "timezone": "America/Havana",
                "offset": "-05:00"
              },
              {
                "countryName": "Cyprus",
                "countryShortName": "CY",
                "timezone": "Asia/Nicosia",
                "offset": "+03:00"
              },
              {
                "countryName": "Czechia",
                "countryShortName": "CZ",
                "timezone": "Europe/Prague",
                "offset": "+02:00"
              },
              {
                "countryName": "Denmark",
                "countryShortName": "DK",
                "timezone": "Europe/Copenhagen",
                "offset": "+02:00"
              },
              {
                "countryName": "Djibouti",
                "countryShortName": "DJ",
                "timezone": "Africa/Djibouti",
                "offset": "+03:00"
              },
              {
                "countryName": "Dominica",
                "countryShortName": "DM",
                "timezone": "America/Dominica",
                "offset": "-04:00"
              },
              {
                "countryName": "Dominican Republic",
                "countryShortName": "DO",
                "timezone": "America/Santo_Domingo",
                "offset": "-04:00"
              },
              {
                "countryName": "Ecuador",
                "countryShortName": "EC",
                "timezone": "America/Guayaquil",
                "offset": "-05:00"
              },
              {
                "countryName": "Egypt",
                "countryShortName": "EG",
                "timezone": "Africa/Cairo",
                "offset": "+02:00"
              },
              {
                "countryName": "El Salvador",
                "countryShortName": "SV",
                "timezone": "America/El_Salvador",
                "offset": "-06:00"
              },
              {
                "countryName": "Equatorial Guinea",
                "countryShortName": "GQ",
                "timezone": "Africa/Malabo",
                "offset": "+01:00"
              },
              {
                "countryName": "Eritrea",
                "countryShortName": "ER",
                "timezone": "Africa/Asmara",
                "offset": "+03:00"
              },
              {
                "countryName": "Estonia",
                "countryShortName": "EE",
                "timezone": "Europe/Tallinn",
                "offset": "+03:00"
              },
              {
                "countryName": "Eswatini",
                "countryShortName": "SZ",
                "timezone": "Africa/Mbabane",
                "offset": "+02:00"
              },
              {
                "countryName": "Ethiopia",
                "countryShortName": "ET",
                "timezone": "Africa/Addis_Ababa",
                "offset": "+03:00"
              },
              {
                "countryName": "Falkland Islands (Malvinas)",
                "countryShortName": "FK",
                "timezone": "Atlantic/Stanley",
                "offset": "-03:00"
              },
              {
                "countryName": "Faroe Islands",
                "countryShortName": "FO",
                "timezone": "Atlantic/Faroe",
                "offset": "+01:00"
              },
              {
                "countryName": "Fiji",
                "countryShortName": "FJ",
                "timezone": "Pacific/Fiji",
                "offset": "+12:00"
              },
              {
                "countryName": "Finland",
                "countryShortName": "FI",
                "timezone": "Europe/Helsinki",
                "offset": "+03:00"
              },
              {
                "countryName": "France",
                "countryShortName": "FR",
                "timezone": "Europe/Paris",
                "offset": "+02:00"
              },
              {
                "countryName": "French Guiana",
                "countryShortName": "GF",
                "timezone": "America/Cayenne",
                "offset": "-03:00"
              },
              {
                "countryName": "French Polynesia",
                "countryShortName": "PF",
                "timezone": "Pacific/Tahiti",
                "offset": "-10:00"
              },
              {
                "countryName": "French Southern Territories",
                "countryShortName": "TF",
                "timezone": "Indian/Kerguelen",
                "offset": "+05:00"
              },
              {
                "countryName": "Gabon",
                "countryShortName": "GA",
                "timezone": "Africa/Libreville",
                "offset": "+01:00"
              },
              {
                "countryName": "Gambia",
                "countryShortName": "GM",
                "timezone": "Africa/Banjul",
                "offset": "+00:00"
              },
              {
                "countryName": "Georgia",
                "countryShortName": "GE",
                "timezone": "Asia/Tbilisi",
                "offset": "+04:00"
              },
              {
                "countryName": "Germany",
                "countryShortName": "DE",
                "timezone": "Europe/Berlin",
                "offset": "+02:00"
              },
              {
                "countryName": "Ghana",
                "countryShortName": "GH",
                "timezone": "Africa/Accra",
                "offset": "+00:00"
              },
              {
                "countryName": "Gibraltar",
                "countryShortName": "GI",
                "timezone": "Europe/Gibraltar",
                "offset": "+02:00"
              },
              {
                "countryName": "Greece",
                "countryShortName": "GR",
                "timezone": "Europe/Athens",
                "offset": "+03:00"
              },
              {
                "countryName": "Greenland",
                "countryShortName": "GL",
                "timezone": "America/Godthab",
                "offset": "-02:00"
              },
              {
                "countryName": "Grenada",
                "countryShortName": "GD",
                "timezone": "America/Grenada",
                "offset": "-04:00"
              },
              {
                "countryName": "Guadeloupe",
                "countryShortName": "GP",
                "timezone": "America/Guadeloupe",
                "offset": "-04:00"
              },
              {
                "countryName": "Guam",
                "countryShortName": "GU",
                "timezone": "Pacific/Guam",
                "offset": "+10:00"
              },
              {
                "countryName": "Guatemala",
                "countryShortName": "GT",
                "timezone": "America/Guatemala",
                "offset": "-06:00"
              },
              {
                "countryName": "Guernsey",
                "countryShortName": "GG",
                "timezone": "Europe/Guernsey",
                "offset": "+01:00"
              },
              {
                "countryName": "Guinea",
                "countryShortName": "GN",
                "timezone": "Africa/Conakry",
                "offset": "+00:00"
              },
              {
                "countryName": "Guinea-Bissau",
                "countryShortName": "GW",
                "timezone": "Africa/Bissau",
                "offset": "+00:00"
              },
              {
                "countryName": "Guyana",
                "countryShortName": "GY",
                "timezone": "America/Guyana",
                "offset": "-04:00"
              },
              {
                "countryName": "Haiti",
                "countryShortName": "HT",
                "timezone": "America/Port-au-Prince",
                "offset": "-04:00"
              },
              {
                "countryName": "Heard Island and McDonald Islands",
                "countryShortName": "HM",
                "timezone": "Indian/Kerguelen",
                "offset": "+05:00"
              },
              {
                "countryName": "Holy See (Vatican City State)",
                "countryShortName": "VA",
                "timezone": "Europe/Vatican",
                "offset": "+02:00"
              },
              {
                "countryName": "Honduras",
                "countryShortName": "HN",
                "timezone": "America/Tegucigalpa",
                "offset": "-06:00"
              },
              {
                "countryName": "Hong Kong",
                "countryShortName": "HK",
                "timezone": "Asia/Hong_Kong",
                "offset": "+08:00"
              },
              {
                "countryName": "Hungary",
                "countryShortName": "HU",
                "timezone": "Europe/Budapest",
                "offset": "+02:00"
              },
              {
                "countryName": "Iceland",
                "countryShortName": "IS",
                "timezone": "Atlantic/Reykjavik",
                "offset": "+00:00"
              },
              {
                "countryName": "India",
                "countryShortName": "IN",
                "timezone": "Asia/Kolkata",
                "offset": "+05:30"
              },
              {
                "countryName": "Indonesia",
                "countryShortName": "ID",
                "timezone": "Asia/Jakarta",
                "offset": "+07:00"
              },
              {
                "countryName": "Iran, Islamic Republic of",
                "countryShortName": "IR",
                "timezone": "Asia/Tehran",
                "offset": "+04:30"
              },
              {
                "countryName": "Iraq",
                "countryShortName": "IQ",
                "timezone": "Asia/Baghdad",
                "offset": "+03:00"
              },
              {
                "countryName": "Ireland",
                "countryShortName": "IE",
                "timezone": "Europe/Dublin",
                "offset": "+01:00"
              },
              {
                "countryName": "Isle of Man",
                "countryShortName": "IM",
                "timezone": "Europe/Isle_of_Man",
                "offset": "+01:00"
              },
              {
                "countryName": "Israel",
                "countryShortName": "IL",
                "timezone": "Asia/Jerusalem",
                "offset": "+03:00"
              },
              {
                "countryName": "Italy",
                "countryShortName": "IT",
                "timezone": "Europe/Rome",
                "offset": "+02:00"
              },
              {
                "countryName": "Jamaica",
                "countryShortName": "JM",
                "timezone": "America/Jamaica",
                "offset": "-05:00"
              },
              {
                "countryName": "Japan",
                "countryShortName": "JP",
                "timezone": "Asia/Tokyo",
                "offset": "+09:00"
              },
              {
                "countryName": "Jersey",
                "countryShortName": "JE",
                "timezone": "Europe/Jersey",
                "offset": "+01:00"
              },              
              {
                "countryName": "Jordan",
                "countryShortName": "JO",
                "timezone": "Asia/Amman",
                "offset": "+03:00"
              },
              {
                "countryName": "Kazakhstan",
                "countryShortName": "KZ",
                "timezone": "Asia/Almaty",
                "offset": "+06:00"
              },
              {
                "countryName": "Kenya",
                "countryShortName": "KE",
                "timezone": "Africa/Nairobi",
                "offset": "+03:00"
              },
              {
                "countryName": "Kiribati",
                "countryShortName": "KI",
                "timezone": "Pacific/Tarawa",
                "offset": "+12:00"
              },
              {
                "countryName": "Korea, Democratic People's Republic of",
                "countryShortName": "KP",
                "timezone": "Asia/Pyongyang",
                "offset": "+08:30"
              },
              {
                "countryName": "Korea, Republic of",
                "countryShortName": "KR",
                "timezone": "Asia/Seoul",
                "offset": "+09:00"
              },
              {
                "countryName": "Kuwait",
                "countryShortName": "KW",
                "timezone": "Asia/Kuwait",
                "offset": "+03:00"
              },
              {
                "countryName": "Kyrgyzstan",
                "countryShortName": "KG",
                "timezone": "Asia/Bishkek",
                "offset": "+06:00"
              },
              {
                "countryName": "Lao People's Democratic Republic",
                "countryShortName": "LA",
                "timezone": "Asia/Vientiane",
                "offset": "+07:00"
              },
              {
                "countryName": "Latvia",
                "countryShortName": "LV",
                "timezone": "Europe/Riga",
                "offset": "+03:00"
              },
              {
                "countryName": "Lebanon",
                "countryShortName": "LB",
                "timezone": "Asia/Beirut",
                "offset": "+03:00"
              },
              {
                "countryName": "Lesotho",
                "countryShortName": "LS",
                "timezone": "Africa/Maseru",
                "offset": "+02:00"
              },
              {
                "countryName": "Liberia",
                "countryShortName": "LR",
                "timezone": "Africa/Monrovia",
                "offset": "+00:00"
              },
              {
                "countryName": "Libya",
                "countryShortName": "LY",
                "timezone": "Africa/Tripoli",
                "offset": "+02:00"
              },
              {
                "countryName": "Liechtenstein",
                "countryShortName": "LI",
                "timezone": "Europe/Vaduz",
                "offset": "+02:00"
              },
              {
                "countryName": "Lithuania",
                "countryShortName": "LT",
                "timezone": "Europe/Vilnius",
                "offset": "+03:00"
              },
              {
                "countryName": "Luxembourg",
                "countryShortName": "LU",
                "timezone": "Europe/Luxembourg",
                "offset": "+02:00"
              },
              {
                "countryName": "Macao",
                "countryShortName": "MO",
                "timezone": "Asia/Macau",
                "offset": "+08:00"
              },
              {
                "countryName": "North Macedonia",
                "countryShortName": "MK",
                "timezone": "Europe/Skopje",
                "offset": "+02:00"
              },
              {
                "countryName": "Madagascar",
                "countryShortName": "MG",
                "timezone": "Indian/Antananarivo",
                "offset": "+03:00"
              },
              {
                "countryName": "Malawi",
                "countryShortName": "MW",
                "timezone": "Africa/Blantyre",
                "offset": "+02:00"
              },
              {
                "countryName": "Malaysia",
                "countryShortName": "MY",
                "timezone": "Asia/Kuala_Lumpur",
                "offset": "+08:00"
              },
              {
                "countryName": "Maldives",
                "countryShortName": "MV",
                "timezone": "Indian/Maldives",
                "offset": "+05:00"
              },
              {
                "countryName": "Mali",
                "countryShortName": "ML",
                "timezone": "Africa/Bamako",
                "offset": "+00:00"
              },
              {
                "countryName": "Malta",
                "countryShortName": "MT",
                "timezone": "Europe/Malta",
                "offset": "+02:00"
              },
              {
                "countryName": "Marshall Islands",
                "countryShortName": "MH",
                "timezone": "Pacific/Majuro",
                "offset": "+12:00"
              },
              {
                "countryName": "Martinique",
                "countryShortName": "MQ",
                "timezone": "America/Martinique",
                "offset": "-04:00"
              },
              {
                "countryName": "Mauritania",
                "countryShortName": "MR",
                "timezone": "Africa/Nouakchott",
                "offset": "+00:00"
              },
              {
                "countryName": "Mauritius",
                "countryShortName": "MU",
                "timezone": "Indian/Mauritius",
                "offset": "+04:00"
              },
              {
                "countryName": "Mayotte",
                "countryShortName": "YT",
                "timezone": "Indian/Mayotte",
                "offset": "+03:00"
              },
              {
                "countryName": "Mexico",
                "countryShortName": "MX",
                "timezone": "America/Mexico_City",
                "offset": "-06:00"
              },
              {
                "countryName": "Micronesia, Federated States of",
                "countryShortName": "FM",
                "timezone": "Pacific/Chuuk",
                "offset": "+10:00"
              },
              {
                "countryName": "Moldova, Republic of",
                "countryShortName": "MD",
                "timezone": "Europe/Chisinau",
                "offset": "+03:00"
              },
              {
                "countryName": "Monaco",
                "countryShortName": "MC",
                "timezone": "Europe/Monaco",
                "offset": "+02:00"
              },
              {
                "countryName": "Mongolia",
                "countryShortName": "MN",
                "timezone": "Asia/Ulaanbaatar",
                "offset": "+08:00"
              },
              {
                "countryName": "Montenegro",
                "countryShortName": "ME",
                "timezone": "Europe/Podgorica",
                "offset": "+02:00"
              },
              {
                "countryName": "Montserrat",
                "countryShortName": "MS",
                "timezone": "America/Montserrat",
                "offset": "-04:00"
              },
              {
                "countryName": "Morocco",
                "countryShortName": "MA",
                "timezone": "Africa/Casablanca",
                "offset": "+01:00"
              },
              {
                "countryName": "Mozambique",
                "countryShortName": "MZ",
                "timezone": "Africa/Maputo",
                "offset": "+02:00"
              },
              {
                "countryName": "Myanmar",
                "countryShortName": "MM",
                "timezone": "Asia/Yangon",
                "offset": "+06:30"
              },
              {
                "countryName": "Namibia",
                "countryShortName": "NA",
                "timezone": "Africa/Windhoek",
                "offset": "+02:00"
              },
              {
                "countryName": "Nauru",
                "countryShortName": "NR",
                "timezone": "Pacific/Nauru",
                "offset": "+12:00"
              },
              {
                "countryName": "Nepal",
                "countryShortName": "NP",
                "timezone": "Asia/Kathmandu",
                "offset": "+05:45"
              },
              {
                "countryName": "Netherlands",
                "countryShortName": "NL",
                "timezone": "Europe/Amsterdam",
                "offset": "+02:00"
              },
              {
                "countryName": "New Caledonia",
                "countryShortName": "NC",
                "timezone": "Pacific/Noumea",
                "offset": "+11:00"
              },
              {
                "countryName": "New Zealand",
                "countryShortName": "NZ",
                "timezone": "Pacific/Auckland",
                "offset": "+12:00"
              },
              {
                "countryName": "Nicaragua",
                "countryShortName": "NI",
                "timezone": "America/Managua",
                "offset": "-06:00"
              },
              {
                "countryName": "Niger",
                "countryShortName": "NE",
                "timezone": "Africa/Niamey",
                "offset": "+01:00"
              },
              {
                "countryName": "Nigeria",
                "countryShortName": "NG",
                "timezone": "Africa/Lagos",
                "offset": "+01:00"
              },
              {
                "countryName": "Niue",
                "countryShortName": "NU",
                "timezone": "Pacific/Niue",
                "offset": "-11:00"
              },
              {
                "countryName": "Norfolk Island",
                "countryShortName": "NF",
                "timezone": "Pacific/Norfolk",
                "offset": "+11:00"
              },
              {
                "countryName": "Northern Mariana Islands",
                "countryShortName": "MP",
                "timezone": "Pacific/Saipan",
                "offset": "+10:00"
              },
              {
                "countryName": "Norway",
                "countryShortName": "NO",
                "timezone": "Europe/Oslo",
                "offset": "+02:00"
              },
              {
                "countryName": "Oman",
                "countryShortName": "OM",
                "timezone": "Asia/Muscat",
                "offset": "+04:00"
              },
              {
                "countryName": "Pakistan",
                "countryShortName": "PK",
                "timezone": "Asia/Karachi",
                "offset": "+05:00"
              },
              {
                "countryName": "Palau",
                "countryShortName": "PW",
                "timezone": "Pacific/Palau",
                "offset": "+09:00"
              },
              {
                "countryName": "Palestinian Territory, Occupied",
                "countryShortName": "PS",
                "timezone": "Asia/Gaza",
                "offset": "+02:00"
              },
              {
                "countryName": "Panama",
                "countryShortName": "PA",
                "timezone": "America/Panama",
                "offset": "-05:00"
              },
              {
                "countryName": "Papua New Guinea",
                "countryShortName": "PG",
                "timezone": "Pacific/Port_Moresby",
                "offset": "+10:00"
              },
              {
                "countryName": "Paraguay",
                "countryShortName": "PY",
                "timezone": "America/Asuncion",
                "offset": "-04:00"
              },
              {
                "countryName": "Peru",
                "countryShortName": "PE",
                "timezone": "America/Lima",
                "offset": "-05:00"
              },
              {
                "countryName": "Philippines",
                "countryShortName": "PH",
                "timezone": "Asia/Manila",
                "offset": "+08:00"
              },
              {
                "countryName": "Pitcairn",
                "countryShortName": "PN",
                "timezone": "Pacific/Pitcairn",
                "offset": "-08:00"
              },
              {
                "countryName": "Poland",
                "countryShortName": "PL",
                "timezone": "Europe/Warsaw",
                "offset": "+02:00"
              },
              {
                "countryName": "Portugal",
                "countryShortName": "PT",
                "timezone": "Europe/Lisbon",
                "offset": "+01:00"
              },
              {
                "countryName": "Puerto Rico",
                "countryShortName": "PR",
                "timezone": "America/Puerto_Rico",
                "offset": "-04:00"
              },
              {
                "countryName": "Qatar",
                "countryShortName": "QA",
                "timezone": "Asia/Qatar",
                "offset": "+03:00"
              },
              {
                "countryName": "Réunion",
                "countryShortName": "RE",
                "timezone": "Indian/Reunion",
                "offset": "+04:00"
              },
              {
                "countryName": "Romania",
                "countryShortName": "RO",
                "timezone": "Europe/Bucharest",
                "offset": "+03:00"
              },
              {
                "countryName": "Russian Federation",
                "countryShortName": "RU",
                "timezone": "Europe/Moscow",
                "offset": "+03:00"
              },
              {
                "countryName": "Rwanda",
                "countryShortName": "RW",
                "timezone": "Africa/Kigali",
                "offset": "+02:00"
              },
              {
                "countryName": "Saint Barthélemy",
                "countryShortName": "BL",
                "timezone": "America/St_Barthelemy",
                "offset": "-04:00"
              },
              {
                "countryName": "Saint Helena, Ascension and Tristan da Cunha",
                "countryShortName": "SH",
                "timezone": "Atlantic/St_Helena",
                "offset": "+00:00"
              },
              {
                "countryName": "Saint Kitts and Nevis",
                "countryShortName": "KN",
                "timezone": "America/St_Kitts",
                "offset": "-04:00"
              },
              {
                "countryName": "Saint Lucia",
                "countryShortName": "LC",
                "timezone": "America/St_Lucia",
                "offset": "-04:00"
              },
              {
                "countryName": "Saint Martin (French part)",
                "countryShortName": "MF",
                "timezone": "America/Marigot",
                "offset": "-04:00"
              },
              {
                "countryName": "Saint Pierre and Miquelon",
                "countryShortName": "PM",
                "timezone": "America/Miquelon",
                "offset": "-02:00"
              },
              {
                "countryName": "Saint Vincent and the Grenadines",
                "countryShortName": "VC",
                "timezone": "America/St_Vincent",
                "offset": "-04:00"
              },
              {
                "countryName": "Samoa",
                "countryShortName": "WS",
                "timezone": "Pacific/Apia",
                "offset": "+14:00"
              },
              {
                "countryName": "San Marino",
                "countryShortName": "SM",
                "timezone": "Europe/San_Marino",
                "offset": "+02:00"
              },
              {
                "countryName": "Sao Tome and Principe",
                "countryShortName": "ST",
                "timezone": "Africa/Sao_Tome",
                "offset": "+00:00"
              },
              {
                "countryName": "Saudi Arabia",
                "countryShortName": "SA",
                "timezone": "Asia/Riyadh",
                "offset": "+03:00"
              },
              {
                "countryName": "Senegal",
                "countryShortName": "SN",
                "timezone": "Africa/Dakar",
                "offset": "+00:00"
              },
              {
                "countryName": "Serbia",
                "countryShortName": "RS",
                "timezone": "Europe/Belgrade",
                "offset": "+02:00"
              },
              {
                "countryName": "Seychelles",
                "countryShortName": "SC",
                "timezone": "Indian/Mahe",
                "offset": "+04:00"
              },
              {
                "countryName": "Sierra Leone",
                "countryShortName": "SL",
                "timezone": "Africa/Freetown",
                "offset": "+00:00"
              },
              {
                "countryName": "Singapore",
                "countryShortName": "SG",
                "timezone": "Asia/Singapore",
                "offset": "+08:00"
              },
              {
                "countryName": "Sint Maarten (Dutch part)",
                "countryShortName": "SX",
                "timezone": "America/Lower_Princes",
                "offset": "-04:00"
              },
              {
                "countryName": "Slovakia",
                "countryShortName": "SK",
                "timezone": "Europe/Bratislava",
                "offset": "+02:00"
              },
              {
                "countryName": "Slovenia",
                "countryShortName": "SI",
                "timezone": "Europe/Ljubljana",
                "offset": "+02:00"
              },
              {
                "countryName": "Solomon Islands",
                "countryShortName": "SB",
                "timezone": "Pacific/Guadalcanal",
                "offset": "+11:00"
              },
              {
                "countryName": "Somalia",
                "countryShortName": "SO",
                "timezone": "Africa/Mogadishu",
                "offset": "+03:00"
              },
              {
                "countryName": "South Africa",
                "countryShortName": "ZA",
                "timezone": "Africa/Johannesburg",
                "offset": "+02:00"
              },
              {
                "countryName": "South Georgia and the South Sandwich Islands",
                "countryShortName": "GS",
                "timezone": "Atlantic/South_Georgia",
                "offset": "-02:00"
              },
              {
                "countryName": "South Sudan",
                "countryShortName": "SS",
                "timezone": "Africa/Juba",
                "offset": "+03:00"
              },
              {
                "countryName": "Spain",
                "countryShortName": "ES",
                "timezone": "Europe/Madrid",
                "offset": "+02:00"
              },
              {
                "countryName": "Sri Lanka",
                "countryShortName": "LK",
                "timezone": "Asia/Colombo",
                "offset": "+05:30"
              },
              {
                "countryName": "Sudan",
                "countryShortName": "SD",
                "timezone": "Africa/Khartoum",
                "offset": "+02:00"
              },
              {
                "countryName": "SuricountryName",
                "countryShortName": "SR",
                "timezone": "America/Paramaribo",
                "offset": "-03:00"
              },
              {
                "countryName": "Svalbard and Jan Mayen",
                "countryShortName": "SJ",
                "timezone": "Arctic/Longyearbyen",
                "offset": "+02:00"
              },
              {
                "countryName": "Sweden",
                "countryShortName": "SE",
                "timezone": "Europe/Stockholm",
                "offset": "+02:00"
              },
              {
                "countryName": "Switzerland",
                "countryShortName": "CH",
                "timezone": "Europe/Zurich",
                "offset": "+02:00"
              },
              {
                "countryName": "Syrian Arab Republic",
                "countryShortName": "SY",
                "timezone": "Asia/Damascus",
                "offset": "+03:00"
              },
              {
                "countryName": "Taiwan, Province of China",
                "countryShortName": "TW",
                "timezone": "Asia/Taipei",
                "offset": "+08:00"
              },
              {
                "countryName": "Tajikistan",
                "countryShortName": "TJ",
                "timezone": "Asia/Dushanbe",
                "offset": "+05:00"
              },
              {
                "countryName": "Tanzania, United Republic of",
                "countryShortName": "TZ",
                "timezone": "Africa/Dar_es_Salaam",
                "offset": "+03:00"
              },
              {
                "countryName": "Thailand",
                "countryShortName": "TH",
                "timezone": "Asia/Bangkok",
                "offset": "+07:00"
              },
              {
                "countryName": "Timor-Leste",
                "countryShortName": "TL",
                "timezone": "Asia/Dili",
                "offset": "+09:00"
              },
              {
                "countryName": "Togo",
                "countryShortName": "TG",
                "timezone": "Africa/Lome",
                "offset": "+00:00"
              },
              {
                "countryName": "Tokelau",
                "countryShortName": "TK",
                "timezone": "Pacific/Fakaofo",
                "offset": "+13:00"
              },
              {
                "countryName": "Tonga",
                "countryShortName": "TO",
                "timezone": "Pacific/Tongatapu",
                "offset": "+13:00"
              },
              {
                "countryName": "Trinidad and Tobago",
                "countryShortName": "TT",
                "timezone": "America/Port_of_Spain",
                "offset": "-04:00"
              },
              {
                "countryName": "Tunisia",
                "countryShortName": "TN",
                "timezone": "Africa/Tunis",
                "offset": "+01:00"
              },
              {
                "countryName": "Turkey",
                "countryShortName": "TR",
                "timezone": "Europe/Istanbul",
                "offset": "+03:00"
              },
              {
                "countryName": "Turkmenistan",
                "countryShortName": "TM",
                "timezone": "Asia/Ashgabat",
                "offset": "+05:00"
              },
              {
                "countryName": "Turks and Caicos Islands",
                "countryShortName": "TC",
                "timezone": "America/Grand_Turk",
                "offset": "-04:00"
              },
              {
                "countryName": "Tuvalu",
                "countryShortName": "TV",
                "timezone": "Pacific/Funafuti",
                "offset": "+12:00"
              },
              {
                "countryName": "Uganda",
                "countryShortName": "UG",
                "timezone": "Africa/Kampala",
                "offset": "+03:00"
              },
              {
                "countryName": "Ukraine",
                "countryShortName": "UA",
                "timezone": "Europe/Kiev",
                "offset": "+03:00"
              },
              {
                "countryName": "United Arab Emirates",
                "countryShortName": "AE",
                "timezone": "Asia/Dubai",
                "offset": "+04:00"
              },
              {
                "countryName": "United Kingdom of Great Britain and Northern Ireland",
                "countryShortName": "GB",
                "timezone": "Europe/London",
                "offset": "+01:00"
              },
              {
                "countryName": "United States of America",
                "countryShortName": "US",
                "timezone": "America/New_York",
                "offset": "-04:00"
              },
              {
                "countryName": "United States Minor Outlying Islands",
                "countryShortName": "UM",
                "timezone": "Pacific/Wake",
                "offset": "+12:00"
              },
              {
                "countryName": "Uruguay",
                "countryShortName": "UY",
                "timezone": "America/Montevideo",
                "offset": "-03:00"
              },
              {
                "countryName": "Uzbekistan",
                "countryShortName": "UZ",
                "timezone": "Asia/Tashkent",
                "offset": "+05:00"
              },
              {
                "countryName": "Vanuatu",
                "countryShortName": "VU",
                "timezone": "Pacific/Efate",
                "offset": "+11:00"
              },
              {
                "countryName": "Venezuela (Bolivarian Republic of)",
                "countryShortName": "VE",
                "timezone": "America/Caracas",
                "offset": "-04:00"
              },
              {
                "countryName": "Viet Nam",
                "countryShortName": "VN",
                "timezone": "Asia/Ho_Chi_Minh",
                "offset": "+07:00"
              },
              {
                "countryName": "Virgin Islands (British)",
                "countryShortName": "VG",
                "timezone": "America/Tortola",
                "offset": "-04:00"
              },
              {
                "countryName": "Virgin Islands (U.S.)",
                "countryShortName": "VI",
                "timezone": "America/St_Thomas",
                "offset": "-04:00"
              },
              {
                "countryName": "Wallis and Futuna",
                "countryShortName": "WF",
                "timezone": "Pacific/Wallis",
                "offset": "+12:00"
              },
              {
                "countryName": "Western Sahara",
                "countryShortName": "EH",
                "timezone": "Africa/El_Aaiun",
                "offset": "+01:00"
              },
              {
                "countryName": "Yemen",
                "countryShortName": "YE",
                "timezone": "Asia/Aden",
                "offset": "+03:00"
              },
              {
                "countryName": "Zambia",
                "countryShortName": "ZM",
                "timezone": "Africa/Lusaka",
                "offset": "+02:00"
              },
              {
                "countryName": "Zimbabwe",
                "countryShortName": "ZW",
                "timezone": "Africa/Harare",
                "offset": "+02:00"
              }
        ];
        const result = await Country.insertMany(countries);
        sendResponse(res, result, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
};

const list = async (req, res) => {
  if (!checkAccess(req)) sendResponse(res, "Only admins can list countries.", BAD_REQUEST);
    try {
        const countries = await Country.find({ isDeleted: "n" },"-isDeleted -createdAt -updatedAt").sort({ countryName: 1 });
        if (!countries) sendResponse(res, "Countries not found", NOT_FOUND);
        else sendResponse(res, countries, OK);
    } catch (err) {
        sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
    }
}

const getTimezones = async (req, res) => {
  if (!checkAccess(req)) sendResponse(res, "Only admins can list timezones.", BAD_REQUEST);
  const { limit, offset } = paginationParams(req);
  try {
      const timezones = await Country.find({ isDeleted: "n" },"timezone");
      if (!timezones) sendResponse(res, "Timezones not found", NOT_FOUND);
      else sendResponse(res, timezones, OK);
  } catch (err) {
      sendResponse(res, err.message, INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
    addCountry,
    list,
    getTimezones
}
