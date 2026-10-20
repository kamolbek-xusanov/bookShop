require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const Book = require("../models/Book")
const User = require("../models/User")

const rows = [
    ["O'tkan kunlar", "Abdulla Qodiriy", 400, "Tarixiy roman", 1926, 65000, "Otabek va Kumushning muhabbati orqali Turkiston xonliklari davrining fojiasi tasvirlanadi. O'zbek adabiyotidagi birinchi roman."],
    ["Mehrobdan chayon", "Abdulla Qodiriy", 340, "Tarixiy roman", 1929, 60000, "Xon saroyidagi fitnalar, ishq va adolatsizlik uchun kurash haqida roman. Voqealar Xudoyorxon davrida kechadi."],
    ["Kecha va kunduz", "Cho'lpon", 330, "Tarixiy roman", 1936, 60000, "Eski va yangi dunyo to'qnashgan yillarda yashagan odamlar taqdiri haqida roman."],
    ["Navoiy", "Oybek", 480, "Tarixiy roman", 1944, 70000, "Alisher Navoiyning bolaligi, ijodi va davlat arbobi sifatidagi hayoti haqida tarixiy roman."],

    ["Jinoyat va jazo", "Fyodor Dostoyevskiy", 560, "Klassik roman", 1866, 80000, "Talaba Raskolnikov \"g'ayrioddiy odam\" nazariyasi ortidan jinoyat qiladi va vijdon azobiga duchor bo'ladi."],
    ["Anna Karenina", "Lev Tolstoy", 860, "Klassik roman", 1878, 95000, "Anna va Vronskiy sevgisi, jamiyat hukmi va oila haqidagi chuqur psixologik roman."],
    ["Buyuk Getsbi", "F. Skott Fitsjerald", 180, "Klassik roman", 1925, 55000, "Boy Getsbining sirli hayoti va yo'qotilgan sevgisini qaytarishga urinishi haqida. 1920-yillar Amerikasi."],
    ["Qari chol va dengiz", "Ernest Xemingvey", 127, "Klassik roman", 1952, 40000, "Keksa baliqchi Santyago ulkan baliq bilan kurashadi. Chidam va qat'iyat haqida qissa."],

    ["Alkimyogar", "Paulo Koelo", 208, "Falsafiy roman", 1988, 50000, "Cho'pon bola Santyago orzusini izlab Misr ehromlariga yo'l oladi. Taqdir va o'z yo'lingni topish haqida."],
    ["Dorian Greyning portreti", "Oskar Uayld", 250, "Falsafiy roman", 1890, 55000, "Go'zal yigit abadiy yosh qolish orzusiga erishadi, lekin gunohlarining izi portretda aks etadi."],

    ["1984", "Jorj Oruell", 330, "Fantastika", 1949, 65000, "Hamma ustidan nazorat o'rnatilgan totalitar jamiyatda Uinston haqiqat uchun kurashishga jur'at etadi."],
    ["Hayvonlar fermasi", "Jorj Oruell", 112, "Fantastika", 1945, 35000, "Hayvonlar xo'jayinlarini quvib chiqaradi, lekin yangi hokimiyat ham zulmga aylanadi. Siyosiy ertak."],
    ["Garri Potter va falsafa toshi", "Joan Roulling", 223, "Fantastika", 1997, 75000, "Yetim bola Garri o'zining sehrgar ekanini bilib, Xogvarts maktabida o'qishni boshlaydi."],
    ["Xobbit", "Jon R. R. Tolkin", 310, "Fantastika", 1937, 70000, "Tinch yashashni yaxshi ko'radigan Bilbo Bekins gnomlar bilan xazina izlab xavfli sayohatga chiqadi."],
    ["Dyuna", "Frenk Xerbert", 600, "Fantastika", 1965, 95000, "Cho'l sayyorasi Arrakisdagi hokimiyat, diniy e'tiqod va ekologiya haqida ilmiy fantastika."],
    ["Farengeyt bo'yicha 451 daraja", "Rey Bredberi", 160, "Fantastika", 1953, 45000, "Kitoblar taqiqlangan va yoqiladigan kelajak haqida. O't o'chiruvchi Montag shubhalana boshlaydi."],

    ["Sherlok Xolms sarguzashtlari", "Artur Konan Doyl", 300, "Detektiv", 1892, 55000, "Buyuk detektiv Sherlok Xolms va doktor Uotsonning eng mashhur ishlari to'plami."],
    ["Sharq ekspressidagi qotillik", "Agata Kristi", 256, "Detektiv", 1934, 55000, "Qor bosgan poyezdda qotillik sodir bo'ladi. Erkyul Puaro barcha yo'lovchilarni so'roq qiladi."],
    ["Va keyin hech kim qolmadi", "Agata Kristi", 272, "Detektiv", 1939, 55000, "O'nta begona odam orolga taklif etiladi va ular birin-ketin o'la boshlaydi."],

    ["Sariq devni minib", "Xudoyberdi To'xtaboyev", 280, "Bolalar adabiyoti", 1963, 45000, "Hasan bilan Husan sehrli sarguzashtlar sari yo'l oladi. Kulgili va qiziqarli ertak-qissa."],
    ["Shum bola", "G'afur G'ulom", 200, "Bolalar adabiyoti", 1936, 40000, "Mirzaobod bolasining hazil-mutoyibaga to'la sarguzashtlari. Yaxshi ko'rib o'qiladigan o'zbek qissasi."],
    ["Kichkina shahzoda", "Antuan de Sent-Ekzyuperi", 96, "Bolalar adabiyoti", 1943, 40000, "Uchuvchi sahroda boshqa sayyoradan kelgan bola bilan uchrashadi. Do'stlik, sevgi va mas'uliyat haqida."],

    ["Sapiens: Insoniyatning qisqacha tarixi", "Yuval Noy Xarari", 450, "Ilmiy-ommabop", 2011, 95000, "Odamzod qadimgi ovchilikdan tortib zamonaviy texnologiyalargacha qanday yo'l bosib o'tganini hikoya qiladi."],
    ["Vaqtning qisqacha tarixi", "Stiven Xoking", 256, "Ilmiy-ommabop", 1988, 70000, "Koinot, qora o'ralar va vaqtning mohiyati haqida oddiy tilda yozilgan kitob."],

    ["Tez va sekin fikrlash", "Daniel Kaneman", 500, "Psixologiya", 2011, 100000, "Inson miyasining ikki tizimi qanday ishlashi va nega xato qarorlar qabul qilishimiz haqida."],
    ["Inson izlagan ma'no", "Viktor Frankl", 200, "Psixologiya", 1946, 50000, "Konslagerdagi hayot tajribasi orqali ma'no topish insonni qanday saqlab qolishini ko'rsatadi."],
    ["Do'st orttirish va odamlarga ta'sir o'tkazish san'ati", "Deyl Karnegi", 300, "Psixologiya", 1936, 60000, "Odamlar bilan muomala qilish, ularning hurmatini qozonish usullari haqida klassik qo'llanma."],

    ["Atom odatlar", "Jeyms Klir", 320, "Biznes va rivojlanish", 2018, 80000, "Kichik o'zgarishlar yordamida yaxshi odatlarni shakllantirish va yomonlarini tashlashning amaliy yo'li."],
    ["Boy ota, kambag'al ota", "Robert Kiyosaki", 336, "Biznes va rivojlanish", 1997, 65000, "Pul haqida ikki xil qarash va moliyaviy savodxonlikni qanday rivojlantirish haqida."],
    ["Chuqur ish", "Kal Nyuport", 296, "Biznes va rivojlanish", 2016, 75000, "Diqqatni to'liq jamlab ishlash qobiliyatini rivojlantirish va samaradorlikni oshirish yo'llari."],
]

const books = rows.map(([nomi, muallifi, sahifasi, Janr, nashrYili, narxi, tavsif]) => ({
    nomi, muallifi, sahifasi, Janr, nashrYili, narxi, tavsif,
    tili: "O'zbek",
    sotuvdaBor: true,
    images: []
}))

module.exports = { books }

async function main() {
    const email = process.argv[2]

    if (!email) {
        console.log("Usage: npm run seed-books -- <sizning-email-ingiz>")
        process.exit(1)
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        console.log(`Foydalanuvchi topilmadi: ${email}. Avval saytda ro'yxatdan o'ting.`)
        await mongoose.disconnect()
        process.exit(1)
    }

    let added = 0
    let skipped = 0

    for (const book of books) {
        const exists = await Book.exists({ nomi: book.nomi, muallifi: book.muallifi })
        if (exists) {
            skipped++
            continue
        }
        await Book.create({ ...book, user: user._id })
        added++
    }

    console.log(`Qo'shildi: ${added}, oldin bor edi (o'tkazib yuborildi): ${skipped}`)
    await mongoose.disconnect()
}

if (require.main === module) {
    main().catch((error) => {
        console.error(error.message)
        process.exit(1)
    })
}