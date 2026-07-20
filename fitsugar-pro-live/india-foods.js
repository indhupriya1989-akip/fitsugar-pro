(function () {
  const regions = {
    "Pan-India Mix":["Vegetable idli with sambar","Sprouts poha","Roti, dal and seasonal sabzi","Millet vegetable khichdi","Chana cucumber chaat","Paneer vegetable bowl"],
    "Andhra Pradesh":["Pesarattu with ginger chutney","Vegetable upma","Pulihora with sprouts salad","Ragi sangati with vegetable dal","Andhra vegetable pappu","Curd rice with cucumber"],
    "Arunachal Pradesh":["Khura buckwheat pancake","Zan millet porridge","Vegetable thukpa","Steamed vegetable momos","Rice with leafy greens","Boiled corn and bean salad"],
    "Assam":["Chira doi with nuts","Jolpan with sprouts","Vegetable khar with rice","Masor tenga with red rice","Joha rice and dal","Aloo pitika with greens"],
    "Bihar":["Sattu vegetable paratha","Chura dahi with seeds","Baked litti with chokha","Dal pitha","Vegetable khichdi with curd","Kala chana ghugni"],
    "Chhattisgarh":["Moong dal chila","Steamed fara","Bore baasi with curd and vegetables","Steamed muthia","Red rice with dal","Angakar roti with greens"],
    "Goa":["Whole-wheat poee with bhaji","Goan fish curry with red rice","Vegetable xacuti with roti","Moong gathi","Sannas with vegetable stew","Kokum buttermilk"],
    "Gujarat":["Steamed khaman dhokla","Vegetable handvo","Methi thepla with curd","Dal dhokli","Bajra rotla with shaak","Vegetable khichdi with kadhi"],
    "Haryana":["Bajra roti with vegetable raita","Besan vegetable cheela","Mixed dal with roti","Bathua paratha with curd","Kadhi with brown rice","Unsweetened salted lassi"],
    "Himachal Pradesh":["Steamed siddu with dal","Chana madra with red rice","Rajma dham bowl","Buckwheat roti with greens","Vegetable thukpa","Pahadi dal with rice"],
    "Jharkhand":["Chilka roti with chutney","Rugra vegetable sabzi","Madua roti with dal","Rice, dal and saag","Unsweetened sattu drink","Steamed rice pitha"],
    "Karnataka":["Ragi mudde with sambar","Vegetable bisi bele bath","Neer dosa with dal curry","Akki rotti with vegetables","Jolada rotti with ennegai","Kosambari protein salad"],
    "Kerala":["Puttu with kadala curry","Appam with vegetable stew","Red rice with fish curry","Avial with dal","Idiyappam with egg curry","Kanji with green gram"],
    "Madhya Pradesh":["Vegetable poha with sprouts","Baked dal bafla","Bhutte ka kees","Jowar roti with dal","Vegetable khichdi","Palak dal with rice"],
    "Maharashtra":["Kanda poha with sprouts","Thalipeeth with curd","Light misal with one pav","Varan bhaat with vegetables","Jowar bhakri with pithla","Mixed matki usal"],
    "Manipur":["Black rice vegetable bowl","Eromba with rice","Chamthong vegetable stew","Nga thongba with rice","Singju salad","Ooti pea curry"],
    "Meghalaya":["Pumaloi with dal","Ja dai lentil rice","Tungrymbai with vegetables","Red rice vegetable stew","Nakham fish soup","Millet porridge with nuts"],
    "Mizoram":["Bai vegetable stew","Lean chicken sawchiar","Steamed rice with fish","Chhum han vegetables","Bamboo shoot bean curry","Millet porridge"],
    "Nagaland":["Sticky rice with vegetables","Smoked fish with greens","Axone vegetable stew","Galho rice porridge","Bamboo shoot lean pork","Millet porridge with seeds"],
    "Odisha":["Pakhala with vegetable sides","Dalma with red rice","Chuda with santula","Chakuli pitha with dal","Machha besara with rice","Ragi manda"],
    "Punjab":["Besan vegetable chilla","Stuffed paratha with curd","Rajma with brown rice","Sarson saag with makki roti","Tandoori chicken salad","Chole with whole-wheat roti"],
    "Rajasthan":["Bajra roti with ker sangri","Portion-controlled dal baati","Moong dal cheela","Gatte ki sabzi with roti","Vegetable khichdi with kadhi","Rabodi vegetable curry"],
    "Sikkim":["Buckwheat pancake","Vegetable thukpa","Steamed momos","Gundruk soup with rice","Kinema curry","Churpi vegetable soup"],
    "Tamil Nadu":["Vegetable idli with sambar","Sundal cup","Millet rice with dal and poriyal","Spiced buttermilk with peanuts","Paneer vegetable dosa","Ragi adai with chutney"],
    "Telangana":["Jonna rotte with dal","Pesarattu with chutney","Vegetable sarva pindi","Bagara rice with dalcha","Ragi sangati with dal","Gongura dal with rice"],
    "Tripura":["Chakhwi vegetable stew","Lean wahan mosdeng","Rice with bamboo shoot vegetables","Muya awandru","Fish stew with greens","Millet porridge"],
    "Uttar Pradesh":["Vegetable poha","Roti, dal and seasonal sabzi","Vegetable tehri with curd","Chana ghugni","Sattu vegetable cheela","Chicken curry with roti"],
    "Uttarakhand":["Mandua roti with dal","Kafuli with brown rice","Chainsoo dal","Jhangora vegetable khichdi","Bhatt ki churkani","Aloo ke gutke with curd"],
    "West Bengal":["Chire doi with nuts","Moong dal chilla","Macher jhol with rice","Shukto with dal","Cholar dal with roti","Vegetable khichuri with egg"],
    "Andaman and Nicobar Islands":["Red rice with grilled fish","Coconut vegetable stew","Rice with dal and greens","Boiled cassava with fish curry","Tropical vegetable salad","Millet porridge"],
    "Chandigarh":["Besan vegetable chilla","Paneer bhurji with roti","Rajma brown rice bowl","Tandoori chicken salad","Chole with roti","Unsweetened lassi"],
    "Dadra and Nagar Haveli and Daman and Diu":["Nagali roti with dal","Ubadiyu vegetable bowl","Fish curry with red rice","Bamboo shoot vegetable curry","Chana salad","Millet khichdi"],
    "Delhi (NCT)":["Vegetable moong chilla","Chole with whole-wheat kulcha","Rajma brown rice bowl","Paneer tikka salad","Roti, dal and sabzi","Chicken curry with roti"],
    "Jammu and Kashmir":["Kahwa with nuts and egg","Nadru yakhni with rice","Rajma with red rice","Haak saag with roti","Lean chicken yakhni","Barley vegetable khichdi"],
    "Ladakh":["Barley khambir with dal","Vegetable thukpa","Steamed momos","Skyu vegetable stew","Tsampa porridge","Buckwheat roti with greens"],
    "Lakshadweep":["Tuna curry with red rice","Coconut dal with rice","Grilled fish salad","Rice roti with vegetable curry","Green gram sundal","Unsweetened coconut buttermilk"],
    "Puducherry":["Vegetable idli with sambar","Creole vegetable stew with rice","Fish curry with red rice","Ragi dosa with chutney","Sundal salad","Vegetable uthappam"]
  };
  const states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];
  const territories = ["Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi (NCT)","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"];
  window.FitSugarIndia = { regions, states, territories };
})();
