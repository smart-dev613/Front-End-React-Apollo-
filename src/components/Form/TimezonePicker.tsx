import React, { Component } from 'react'
import Select from './Select'

export const timezones = [
  { "label": "(GMT-12:00) International Date Line West", "value": "-12___International Date Line West" },
  { "label": "(GMT-11:00) Midway Island, Samoa", "value": "-11___Midway Island, Samoa" },
  { "label": "(GMT-10:00) Hawaii", "value": "-10___Hawaii" },
  { "label": "(GMT-09:00) Alaska", "value": "-9___Alaska" },
  { "label": "(GMT-08:00) Pacific Time (US & Canada)", "value": "-8___Pacific Time (US & Canada)" },
  { "label": "(GMT-08:00) Tijuana, Baja California", "value": "-8___Tijuana, Baja California" },
  { "label": "(GMT-07:00) Arizona", "value": "-7___Arizona" },
  { "label": "(GMT-07:00) Chihuahua, La Paz, Mazatlan", "value": "-7___Chihuahua, La Paz, Mazatlan" },
  { "label": "(GMT-07:00) Mountain Time (US & Canada)", "value": "-7___Mountain Time (US & Canada)" },
  { "label": "(GMT-06:00) Central America", "value": "-6___Central America" },
  { "label": "(GMT-06:00) Central Time (US & Canada)", "value": "-6___Central Time (US & Canada)" },
  { "label": "(GMT-05:00) Bogota, Lima, Quito, Rio Branco", "value": "-5___Bogota, Lima, Quito, Rio Branco" },
  { "label": "(GMT-05:00) Eastern Time (US & Canada)", "value": "-5___Eastern Time (US & Canada)" },
  { "label": "(GMT-05:00) Indiana (East)", "value": "-5___Indiana (East)" },
  { "label": "(GMT-04:00) Atlantic Time (Canada)", "value": "-4___Atlantic Time (Canada)" },
  { "label": "(GMT-04:00) Caracas, La Paz", "value": "-4___Caracas, La Paz" },
  { "label": "(GMT-04:00) Manaus", "value": "-4___Manaus" },
  { "label": "(GMT-04:00) Santiago", "value": "-4___Santiago" },
  { "label": "(GMT-03:30) Newfoundland", "value": "-3.5___Newfoundland" },
  { "label": "(GMT-03:00) Brasilia", "value": "-3___Brasilia" },
  { "label": "(GMT-03:00) Buenos Aires, Georgetown", "value": "-3___Buenos Aires, Georgetown" },
  { "label": "(GMT-03:00) Greenland", "value": "-3___Greenland" },
  { "label": "(GMT-03:00) Montevideo", "value": "-3___Montevideo" },
  { "label": "(GMT-02:00) Mid-Atlantic", "value": "-2___Mid-Atlantic" },
  { "label": "(GMT-01:00) Cape Verde Is.", "value": "-1___Cape Verde Is" },
  { "label": "(GMT-01:00) Azores", "value": "-1___Azores" },
  { "label": "(GMT+00:00) Casablanca, Monrovia, Reykjavik", "value": "0___Casablanca, Monrovia, Reykjavik" },
  { "label": "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "value": "0___Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London" },
  { "label": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "value": "1___Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna" },
  { "label": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "value": "1___Belgrade, Bratislava, Budapest, Ljubljana, Prague" },
  { "label": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "value": "1___Brussels, Copenhagen, Madrid, Paris" },
  { "label": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", "value": "1___Sarajevo, Skopje, Warsaw, Zagreb" },
  { "label": "(GMT+01:00) West Central Africa", "value": "1___West Central Africa" },
  { "label": "(GMT+02:00) Amman", "value": "2___Amman" },
  { "label": "(GMT+02:00) Athens, Bucharest, Istanbul", "value": "2___Athens, Bucharest, Istanbul" },
  { "label": "(GMT+02:00) Beirut", "value": "2___Beirut" },
  { "label": "(GMT+02:00) Cairo", "value": "2___Cairo" },
  { "label": "(GMT+02:00) Harare, Pretoria", "value": "2___Harare, Pretoria" },
  { "label": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "value": "2___Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius" },
  { "label": "(GMT+02:00) Jerusalem", "value": "2___Jerusalem" },
  { "label": "(GMT+02:00) Minsk", "value": "2___Minsk" },
  { "label": "(GMT+02:00) Windhoek", "value": "2___Windhoek" },
  { "label": "(GMT+03:00) Kuwait, Riyadh, Baghdad", "value": "3___Kuwait, Riyadh, Baghdad" },
  { "label": "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "value": "3___Moscow, St. Petersburg, Volgograd" },
  { "label": "(GMT+03:00) Nairobi", "value": "3___Nairobi" },
  { "label": "(GMT+03:00) Tbilisi", "value": "3___Tbilisi" },
  { "label": "(GMT+03:30) Tehran", "value": "3.5___Tehran" },
  { "label": "(GMT+04:00) Abu Dhabi, Muscat", "value": "4___Abu Dhabi, Muscat" },
  { "label": "(GMT+04:00) Baku", "value": "4___Baku" },
  { "label": "(GMT+04:00) Yerevan", "value": "4___Yerevan" },
  { "label": "(GMT+04:30) Kabul", "value": "4.5___Kabul" },
  { "label": "(GMT+05:00) Yekaterinburg", "value": "5___Yekaterinburg" },
  { "label": "(GMT+05:00) Islamabad, Karachi, Tashkent", "value": "5___Islamabad, Karachi, Tashkent" },
  { "label": "(GMT+05:30) Sri Jayawardenapura", "value": "5.5___Sri Jayawardenapura" },
  { "label": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", "value": "5.5___Chennai, Kolkata, Mumbai, New Delhi" },
  { "label": "(GMT+05:45) Kathmandu", "value": "5.75___Kathmandu" },
  { "label": "(GMT+06:00) Almaty, Novosibirsk", "value": "6___Almaty, Novosibirsk" },
  { "label": "(GMT+06:00) Astana, Dhaka", "value": "6___Astana, Dhaka" },
  { "label": "(GMT+06:30) Yangon (Rangoon)", "value": "6.5___Yangon (Rangoon)" },
  { "label": "(GMT+07:00) Bangkok, Hanoi, Jakarta", "value": "7___Bangkok, Hanoi, Jakarta" },
  { "label": "(GMT+07:00) Krasnoyarsk", "value": "7___Krasnoyarsk" },
  { "label": "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "value": "8___Beijing, Chongqing, Hong Kong, Urumqi" },
  { "label": "(GMT+08:00) Kuala Lumpur, Singapore", "value": "8___Kuala Lumpur, Singapore" },
  { "label": "(GMT+08:00) Irkutsk, Ulaan Bataar", "value": "8___Irkutsk, Ulaan Bataar" },
  { "label": "(GMT+08:00) Perth", "value": "8___Perth" },
  { "label": "(GMT+08:00) Taipei", "value": "8___Taipei" },
  { "label": "(GMT+09:00) Osaka, Sapporo, Tokyo", "value": "9___Osaka, Sapporo, Tokyo" },
  { "label": "(GMT+09:00) Seoul", "value": "9___Seoul" },
  { "label": "(GMT+09:00) Yakutsk", "value": "9___Yakutsk" },
  { "label": "(GMT+09:30) Adelaide", "value": "9.5___Adelaide" },
  { "label": "(GMT+09:30) Darwin", "value": "9.5___Darwin" },
  { "label": "(GMT+10:00) Brisbane", "value": "10___Brisbane" },
  { "label": "(GMT+10:00) Canberra, Melbourne, Sydney", "value": "10___Canberra, Melbourne, Sydney" },
  { "label": "(GMT+10:00) Hobart", "value": "10___Hobart" },
  { "label": "(GMT+10:00) Guam, Port Moresby", "value": "10___Guam, Port Moresby" },
  { "label": "(GMT+10:00) Vladivostok", "value": "10___Vladivostok" },
  { "label": "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "value": "11___Magadan, Solomon Is., New Caledonia" },
  { "label": "(GMT+12:00) Auckland, Wellington", "value": "12___Auckland, Wellington" },
  { "label": "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", "value": "12___Fiji, Kamchatka, Marshall Is" },
  { "label": "(GMT+13:00) Nuku'alofa", "value": "1___Nuku'3" }
]

interface TimezonePickerProps {
  size?: number
  inForm?: boolean
  noPaddingLeft?: boolean
  onChange?: (e: Event) => void
  isRequired?: string
  unselectLabel?: string
  colSize?: string
  id?: string
  name?: string
  value?: object
  disabled?: boolean
}

class TimezonePicker extends Component<TimezonePickerProps> {
  public render() {
    return (
      <Select
        type='number'
        isRequired={this.props.isRequired}
        options={timezones}
        name={this.props.name}
        colSize={this.props.colSize}
        id={this.props.id}
        disabled={this.props.disabled}
        onChange={this.props.onChange}
        value={this.props.value}
        multiple = {false}
      />
    )
  }
}

export default TimezonePicker
