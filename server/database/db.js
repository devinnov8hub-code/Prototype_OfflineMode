const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./exam.db");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      text TEXT,
      options TEXT,
      correct_answer INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      student_id TEXT,
      question_id INTEGER,
      answer INTEGER,
      source TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO questions
    (id, text, options, correct_answer)
    VALUES (?, ?, ?, ?)
  `);

  const questions = [

    [1,"2 + 2 = ?","1,2,3,4",3],
    [2,"5 x 3 = ?","10,15,20,25",1],
    [3,"Square root of 9?","1,2,3,4",2],
    [4,"10 / 2 = ?","2,3,4,5",3],
    [5,"7 + 6 = ?","11,12,13,14",2],

    [6,"Capital of France?","Berlin,Madrid,Paris,Rome",2],
    [7,"Capital of Germany?","Berlin,Rome,Paris,London",0],
    [8,"Largest ocean?","Atlantic,Indian,Arctic,Pacific",3],
    [9,"Continent of Nigeria?","Asia,Africa,Europe,America",1],
    [10,"UN Headquarters?","London,New York,Paris,Rome",1],

    [11,"HTML stands for?","HyperText Markup Language,HighText Machine Language,Home Tool Markup Language,Hyperlinks Text",0],
    [12,"CSS used for?","Structure,Styling,Database,Logic",1],
    [13,"JS runs on?","Server only,Browser only,Both,None",2],
    [14,"Binary of 2?","10,11,01,100",0],
    [15,"1 byte = ? bits","4,8,16,32",1],

    [16,"Sun is a?","Planet,Star,Comet,Asteroid",1],
    [17,"Water formula?","H2O,CO2,O2,H2",0],
    [18,"Earth shape?","Flat,Square,Spherical,Cube",2],
    [19,"Speed of light approx?","300k km/s,150k,1M,50k",0],
    [20,"Gas for breathing?","CO2,O2,H2,N2",1],

    [21,"5^2 = ?","10,20,25,30",2],
    [22,"12 - 7 = ?","3,4,5,6",2],
    [23,"9 + 8 = ?","15,16,17,18",2],
    [24,"4 x 6 = ?","20,22,24,26",2],
    [25,"15 / 3 = ?","3,4,5,6",2],

    [26,"Largest planet?","Earth,Mars,Jupiter,Saturn",2],
    [27,"Human heart chambers?","2,3,4,5",2],
    [28,"Language of Brazil?","Spanish,Portuguese,French,English",1],
    [29,"Fastest land animal?","Lion,Tiger,Cheetah,Horse",2],
    [30,"Primary color?","Red,Black,Brown,Gray",0],
        [31,"3 + 5 = ?","6,7,8,9",2],
    [32,"6 x 7 = ?","36,40,42,48",2],
    [33,"20 - 9 = ?","9,10,11,12",2],
    [34,"8 / 4 = ?","1,2,3,4",1],
    [35,"9 x 9 = ?","72,80,81,90",2],

    [36,"Capital of Italy?","Milan,Rome,Venice,Turin",1],
    [37,"Capital of Spain?","Madrid,Barcelona,Seville,Valencia",0],
    [38,"Capital of Japan?","Beijing,Seoul,Tokyo,Bangkok",2],
    [39,"Capital of Canada?","Toronto,Ottawa,Vancouver,Montreal",1],
    [40,"Capital of Ghana?","Lagos,Accra,Kumasi,Abuja",1],

    [41,"HTML is for?","Programming,Structure,Styling,Database",1],
    [42,"CSS stands for?","Creative Style Sheets,Cascading Style Sheets,Colorful Style Sheets,Computer Style Sheets",1],
    [43,"JS means?","JavaSource,JavaScript,JustScript,JointScript",1],
    [44,"CPU stands for?","Central Process Unit,Central Processing Unit,Computer Personal Unit,Core Process Unit",1],
    [45,"RAM is?","Storage,Memory,CPU,Disk",1],

    [46,"Moon is a?","Star,Planet,Satellite,Comet",2],
    [47,"Boiling point of water?","50C,75C,90C,100C",3],
    [48,"Freezing point of water?","0C,10C,20C,5C",0],
    [49,"Planet we live on?","Mars,Venus,Earth,Jupiter",2],
    [50,"Closest star to Earth?","Sirius,Sun,Polaris,Alpha Centauri",1],

    [51,"11 + 12 = ?","21,22,23,24",2],
    [52,"14 x 2 = ?","26,28,30,32",1],
    [53,"30 / 5 = ?","5,6,7,8",1],
    [54,"18 - 3 = ?","12,15,16,14",1],
    [55,"7 x 8 = ?","54,56,58,60",1],

    [56,"Largest mammal?","Elephant,Blue Whale,Giraffe,Hippo",1],
    [57,"Bird that can't fly?","Eagle,Pigeon,Ostrich,Sparrow",2],
    [58,"King of jungle?","Tiger,Lion,Leopard,Cheetah",1],
    [59,"Baby dog called?","Cub,Kitten,Puppy,Calf",2],
    [60,"Animal with trunk?","Lion,Elephant,Horse,Zebra",1],

    [61,"Red + Blue = ?","Green,Purple,Orange,Brown",1],
    [62,"Primary color?","Green,Purple,Blue,Pink",2],
    [63,"Rainbow colors count?","5,6,7,8",2],
    [64,"Color of sun in drawings?","Blue,Yellow,Green,Black",1],
    [65,"Mix red + yellow?","Orange,Green,Purple,Brown",0],

    [66,"1 week = ? days","5,6,7,8",2],
    [67,"1 year = ? months","10,11,12,13",2],
    [68,"Leap year days?","364,365,366,367",2],
    [69,"60 seconds = ? minute","1,2,3,4",0],
    [70,"24 hours = ? day","1,2,3,4",0],

    [71,"Largest continent?","Africa,Asia,Europe,America",1],
    [72,"River Nile in?","Asia,Africa,Europe,Australia",1],
    [73,"Sahara is a?","Forest,Desert,Ocean,Lake",1],
    [74,"Mount Everest type?","River,Mountain,Plateau,Valley",1],
    [75,"Nigeria currency?","Cedi,Naira,Rand,Dollar",1],

    [76,"Device to call?","Radio,Television,Phone,Microwave",2],
    [77,"Internet browser?","Chrome,Word,Excel,Paint",0],
    [78,"Keyboard used to?","Type,Draw,Print,Scan",0],
    [79,"Mouse used to?","Point,Listen,Talk,Print",0],
    [80,"Monitor shows?","Sound,Output,Input,Storage",1],

    [81,"5 + 10 = ?","10,15,20,25",1],
    [82,"16 / 4 = ?","2,3,4,5",2],
    [83,"3 x 12 = ?","30,32,36,40",2],
    [84,"50 - 20 = ?","20,25,30,35",2],
    [85,"100 / 10 = ?","5,10,15,20",1],

    [86,"First month?","January,March,June,December",0],
    [87,"Last month?","October,November,December,September",2],
    [88,"Weekend day?","Monday,Tuesday,Saturday,Wednesday",2],
    [89,"5 days after Monday?","Friday,Saturday,Sunday,Thursday",2],
    [90,"Day before Friday?","Wednesday,Thursday,Monday,Sunday",1],

    [91,"Shape with 3 sides?","Square,Triangle,Circle,Oval",1],
    [92,"Shape like ball?","Square,Circle,Triangle,Rectangle",1],
    [93,"4 equal sides?","Triangle,Rectangle,Square,Circle",2],
    [94,"Stop sign color?","Blue,Green,Red,Yellow",2],
    [95,"School writing tool?","Spoon,Pen,Plate,Cup",1],

    [96,"Opposite of hot?","Warm,Cool,Cold,Boiling",2],
    [97,"Opposite of big?","Large,Small,Tall,Wide",1],
    [98,"Opposite of fast?","Quick,Slow,Speed,Rapid",1],
    [99,"Morning comes after?","Noon,Night,Evening,Afternoon",1],
    [100,"2 x 10 = ?","10,20,30,40",1]

  ];

  questions.forEach(q => stmt.run(q));

  stmt.finalize();

  console.log("100 Questions seeded");
});

module.exports = db;
