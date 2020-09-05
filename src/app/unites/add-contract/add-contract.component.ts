import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnitService } from 'src/app/unit.service';
import { ServicesService } from 'src/app/services.service';
import { UnitesComponent } from '../unites.component';
import { ContractData } from 'src/app/contract-data';
import { ContractInpts } from 'src/app/contract-inpts';
import { ClientsData } from 'src/app/clients-data';
import { ContractVaildInpts } from 'src/app/contract-vaild-inpts';
import { UnitData } from 'src/app/unit-data';
import { TowerData } from 'src/app/tower-data';

@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  clients: ClientsData[];
  units: UnitData[];
  filteredUnits: any[];
  contractVaild: boolean;

  contractData: ContractData;

  NumInwords: string;
  prepaidCashStr: string;
  prepaidCashInWords: string;
  remainCashStr: string;
  tamheedSecText: string;
  tarafAwalText: string;
  thrdBandText: { fstLine: string; sndLine: { title: string; fstCond: string; sndCond: string; thrdCond: string; fourthCond: string; fifthCond: string; sixCond: string; }; };
  fourthBandText: {
    fstLine: string;
    paymentInfo: {
      mainDetail_1: string;
      mainDetail_3: string;
      paidDetail_1: string;
      remPaidDetail_1: string;
      remPaidDetail_3: string;
    };
    paragraphFstLine: string;
    paragraphSec: string;
    paragraphEnd: string;
  };
  fifthBandText: { firstSec: string; secSec: string; };
  sixBand: string;
  sevBand: string;
  eightBand: string;
  unitFloarText: any;
  secBandText: { fst: string; sec: string; third: string; four: string; five: string; };
  nineBand: string;
  tenBand: string;
  elevenBand: string;
  therteenBand: string;
  fourteenBand: string;
  coNameLast: string;

  constructor(public router: Router, public _unitService: UnitService,
    public _service: ServicesService, _unitesComponent: UnitesComponent) { }



  //theANum: string = '1000000'

  ngOnInit() {

    this.makeContractBands();

    this._unitService.contractInpts = new ContractInpts();
    this._unitService.contractInpts.towerinfo = null;
    this._unitService.contractVaildInpts = new ContractVaildInpts();

    this._unitService.getClients().subscribe((data: ClientsData[]) => {
      this.clients = data;
    });

    this._unitService.getUnites().subscribe((data: UnitData[]) => {
      this.units = data;
    })

    $('#theContractText').on('click', 'textarea', function () {
      $(this).height(0).height(this.scrollHeight);
    }).find('textarea').change()

    this.setContractTexts();
    this.dateBegainChanged();

  };

  openwindowPrint() {

    window.print();

  };

  inWords(numb) {

    let n: any;
    let num = "521230"

    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : ''; // مليون
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : ''; // مائة الف
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : ''; // الف
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''; // مائة
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  };

  inArabicWords = (number) => {
    let aNum: any;
    //this.theANum = "320862"

    var one = ['', 'واحد ', 'اثنان ', 'ثلاثة ', 'اربعة ', 'خمسة ', 'ستة ', 'سبعة ', 'ثمانية ', 'تسعة ', 'عشرة ', 'احدى عشر ', 'اثنى عشر ', 'ثلاثة عشر ', 'اربعة عشر ', 'خمسة عشر ', 'ستة عشر ', 'سبعة عشر ', 'ثمانية عشر ', 'تسعة عشر '];
    var two = ['', '', ' عشرون ', 'ثلاثون ', 'اربعون ', 'خمسون ', 'ستون ', 'سبعون ', 'ثمانون ', 'تسعون'];
    var hund = ['', 'مائة', 'مئتان', 'ثلاثمائة ', 'اربعمائة ', 'خمسمائة', 'ستمائة ', 'سبعمائة', 'ثمانمائة', 'تسعمائة ']

    if ((number = number.toString()).length > 9) return 'overflow';
    aNum = ('000000000' + number).substr(-9).match(/^(\d{2})(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);
    if (!aNum) return; var strA = '';
    strA += (aNum[1] != 0) ? (one[Number(aNum[1])] || two[aNum[1][0]] + ' ' + one[aNum[1][1]]) + 'بليون ' : '';
    strA += (aNum[2] != 0) ? (one[Number(aNum[2])] || two[aNum[2][0]] + ' ' + one[aNum[2][1]]) + 'مليون ' : '';

    strA += (aNum[3] != 0) ?
      ((aNum[2] != 0) ? 'و ' : '') +
      `${(hund[Number(aNum[3])])} ` +
      ((aNum[4] == 0) ? 'الف ' : '')
      : '';

    strA += (aNum[4] != 0) ?
      ((aNum[3] != 0 && one[aNum[4][1]] != '') ? 'و' : '') +
      ((one[Number(aNum[4])] != undefined) ? ` ${one[Number(aNum[4])]} الف ` : `${one[aNum[4][1]]}و ${two[aNum[4][0]]} الف `) : '';

    strA += (aNum[5] != 0) ? `و ${(hund[Number(aNum[5])])} ` : '';

    strA += (aNum[6] != 0) ? ((one[aNum[6][1]] != '') ? 'و ' : '') + (one[Number(aNum[6])] || `${one[aNum[6][1]]}و ${two[aNum[6][0]]}`) : '';

    return strA;

  };
  relig: string = 'مسلم'

  makeContractBands = () => {

    this.tamheedSecText = `الطرف الأول من أكبر الشركات العاملة والمتخصصة في كافة مجالات الإسكان بكافة أنواعه ، وقد شرع في
    إقامة حي سكني راق متكامل وفقاً لأعلى مراتب البناء العمراني ويتمتع بالذوق العمراني والمعماري
    الرفيع والخدمات والمرافق الجديدة وتتوافر بداخله المساحات الخضراء وكافة الخدمات والمستلزمات
    للإقامة به.
    وعلى ذلك الأمر كان الطرف الأول يمتلك كامل ارض وبناء وانشاء العمارت
    بالمشروع المسمى ( مدينة نصر الجديدة)والمقام على قطعة الأرض رقم (25) بناحية جنوب مدينة نصر
    أمتداد شارع حسن مأمون- الحي العاشر-مدينة نصر- القاهرة.
    وذلك بموجب عقد المقاوله المؤرخ في 23/10/2016 م وبموجب توكيل رسمي مخصص رقم 863 أ لسنة 2016 توثيق
    نادي الزهور .الصادر من شركة هليوبوليس للإنشاءات العقارية والاستثمارات السياحيةش.م.م التي الت
    اليها الارض المقام عليها المشروع بموجب قرار التخصيص الصادر من محافظة القاهرة، وقرار التقسيم رقم
    2331 لسنة 2007، أما أعمال التشييد والبناء بموجب الترخيص رقم 142 لسنة 1999 للمشروع والعمارة مكونة
    من بدروم (جراج) وأرضي و إحدى عشر دور متكرر.وقد أبدى الطرف الثاني رغبته الجدية الخالية من الغبن
    والجهالة في شراء شقة بقصد التملك ومن ثم فقد وافق الطرف الأول على هذه الرغبة ، وبعد أن أقر كل
    منهما بأهليته للتصرف وخلوهما من الموانع القانونية والتعاقد وعدم وجود مانع بشأن التعاقد لذا فقد
    أتفقا على تحرير هذا العقد بالبنود والشروط الآتية`

    this.tarafAwalText = `سجل تجاري رقم 387687 القاهره والكائن مقرها 10 أ عمارات مدينة نصر الجديدة – امتداد شارع حسن
    مأمون- الحي العاشر- مدينة نصر- القاهرة ، ويمثلها في التوقيع السيد / حاتم حسين علي عبد الرحمن
    بصفته مدير الشركة ويحمل بطاقه رقم 27704150101939 `

    this.thrdBandText = {
      fstLine: `الأجزاء المشتركة :-`,
      sndLine: {
        title: `يقصد بالأجزاء المشتركة في العقار الذي يقع به الوحدة المبيعة الأساسات والحوائط والجدران الرئيسية أو الحاملة أو التي تتأثر بها سلامة العقار و المدخل و السلالم الرئيسية و التوصيلات والكابلات و الأنابيب الرئيسية الموصلة للطاقة أو المياه أو الصرف الصحي أو غير ذلك بإستثناء كل ما لا يخدم الوحدة المبيعة ، كذلك لا يدخل ضمن الأجزاء المشتركة أسطح العقار أو الجراج أسفل العقار.`,
        fstCond: `1)	مراعاة كافة القوانين واللوائح و الأوامر الصادرة من جهات الإختصاص خاصة مايتعلق منها بملكية الطبقات.`,
        sndCond: `2)	عدم إجراء أية تغيرات أو تعديلات من أي نوع كان في عين موضوع التعامل أو القيام بأية أعمال من شأنها الإضرار بأجزاء المشتركة أو المعدة للإستعمال المشترك أو إستعمالها في غير ما هي مخصصة له أو إستخدامها على نحو يخل أو يحرم باقي الملاك من الإنتفاع بها أو يقلل من انتفاعهم بها أو يهدد بذلك.`,
        thrdCond: `3)	دون الإخلال بحكم الفقرة السابقة فإن الطرف الثاني يمتنع عليه على وجه الخصوص إجراء أية تعديلات تخل 
        بالشكل العام للمباني أو بالمظهر العام للمشروع أو النواحي الهندسية به إلا بعد الحصول على موافقة كتابية من الطرف الأول أو من شركة إدارة المشروع عند تكوينها وبعد إجراء معاينة هندسية على نفقة الطرف الثاني (المشتري) ويتم إزالة أية أعمال تتم دون ذلك على نفقة الطرف الثاني.
        `,
        fourthCond: `4)	يحظر على الطرف الثاني عمل حظائر حيوانية أو طيور أو إستخدام أية آلات أو معدات مقلقة للراحة أو مضر بالصحة العامة أو البيئة أو المناخ العام للمشروع.`,
        fifthCond: `5)	يتعهد الطرف الثاني بالامتناع عن القيام بأية أعمال مقلقه للراحة أو مضره بالصحة أو خطره في الوحدة المبيعة أو إحداث أي تعديل في الأجزاء العامة المشتركة.`,
        sixCond: `6)	يتعهد الطرف الثاني فور استلامه الوحدة موضوع هذا العقد بإبلاغ مأموريه العوائد المختصة كما يتعهد بسداد الضريبة العقارية وكافة الرسوم والالتزامات التي تقرر علي الوحدة المذكورة.`,
      },
    };

    this.fourthBandText = {
      fstLine: `الثمن وتنظيم السداد:-`,
      paymentInfo: {

        mainDetail_1: `تم هذا البيع وقبوله من المشتري لقاء 
        ثمن و قدره `,
        //_unitService.contractInpts.unitTotalPrice
        //mainDetail_2: ` جم ) ( فقط `,
        // NumInwords
        mainDetail_3: ` وأن هذا الثمن ثابت و نهائي.`,

        paidDetail_1: `و قام الطرف الثاني المشتري بسداد مبلغ وقدره `,
        // this._unitService.contractInpts.prepaidCash
        //paidDetail_2: ` جم)
        //(فقط `,
        // prepaidCashInWords
        //paidDetail_3: ` جنيها مصريا لاغير)`,

        remPaidDetail_1: `و المبلغ المتبقى و قدره `,
        // _unitService.contractInpts.remainCash
        //remPaidDetail_2: ` جم )
        //(فقط `,
        // remainCashStr
        remPaidDetail_3: `يتم سداده بدون فوائد كالآتى :-`,
      },
      paragraphFstLine: `وبضمان أمتياز البائع المقرر قانوناً على العقار المبيع ، على أن يقوم الطرف الثاني (المشتري) بسداد الأقساط للطرف الأول – البائع بموجب إيصالات السداد الدالة على ذلك.`,
      paragraphSec: `ومن المتفق عليه بين الأطراف أن نفاذ عقد البيع هذا معلق على شرط واقف بالتطبيق لحكم المادة 268 من القانون المدني رقم 131 لسنة 
      1947 وهو وفاء المشتري بكامل قيمة الأقساط المشار إليها سلفا في مواعيد إستحقاق كل منها بدون تأخير أو تقاعس ،
       وتبقى ملكية الشقة المباعة ثابتة وآمنة للطرف الأول ، ويكون له حق إمتياز عليها وفقا لأحكام مواد القانون المدني وذلك حتى قيام الطرف الثاني المشتري بسداد كامل الثمن وحتى أخر قسط.`,
      paragraphEnd: `وفي حالة تأخير أو تقاعس الطرف الثاني المشتري عند سداد آي قسط من الأقساط المستحقة أو جزء منه في المواعيد المحددة
       لها لمدة تزيد عن ستون يوما عن تاريخ الاستحقاق في كامل مدة سداد الأقساط يعتبر هذا العقد مفسوخا من تلقاء نفسه
        دون إنذار أو إعذار أو تنبيه أو اللجوء للقضاء أو حكم قضائي أو أي إجراء قانوني آخر
        وفي هذه الحالة يكون للطرف الأول الحق في بيع الوحدة موضوع هذا العقد إلى الغير ،
        ودون أدنى اعتراض من الطرف الثاني المشتري على ذلك التصرف ،
        ويحق للطرف الثاني في هذه الحالة أو في حالة طلبه لفسخ التعاقد إسترداد المبالغ المدفوعة بنفس الطريقة
        التي قام بسدادها وذلك بعد بيع الوحدة محل التعاقد و تبدأ من تاريخ فسخ العقد .
        مخصوماً منها نسبة قدرها 10% من إجمالي ثمن الوحدة موضوع هذا العقد كمصاريف إدارية مع حفظ كافة الحقوق في غرامات التأخير والفوائد المحتسبة عليها إن وجدت.`,
    };

    this.fifthBandText = {
      firstSec: `الملكية:
      آلت الملكية كامل الأرض بموجب بموجب عقد المقاوله المؤرخ في 23/10/2016 م
       وبموجب توكيل رسمي مخصص رقم 863 أ لسنة 2016 توثيق نادي الزهور .
       الصادر من شركة هليوبوليس للإنشاءات العقارية والاستثمارات السياحية ش.م.م
       التي الت اليها الارض المقام عليها المشروع بموجب قرار التخصيص الصادر من محافظة القاهرة، 
       وقرار التقسيم رقم 693 لسنة 1998 من قبل محافظة القاهرة و تأخذ قطعة رقم (25) تقسيم جنوب مدينة نصر`,
      secSec: `أما المباني بالإقامة والتشييد بمعرفة البائع بموجب ترخيص البناء رقم 78 لسنة 1999 الصادر من حي مدينة نصر.
       و الملكية مسجلة بالكامل بموجب العقد المشهر تحت رقم 3717 لسنة 2003 شمال القاهرة. 
       ويقر الطرف الأول بأن الوحدة المبيعة مملوكة له ولا يوجد للغير أية حقوق عينية أو تبعية عليها
       عدا الرهن العقاري لصالح البنك العقاري و الذي يلتزم فيه بسداده الطرف الأول وحده. 
       وأنه يحوزها حيازة هادئة وظاهرة دون تعرض من الغير،
       ويضمن للمشتري عدم تعرضه أو تعرض الغير في الوحدة المبيعة طبقاً لنص المادة 439 من القانون المدني. `,
    };

    this.sixBand = `يقر الطرف الثاني بأنه قد أطلع على الرسومات الهندسية للشقة محل التعاقد
     وأنه قام بالمعاينة التامة والنافية للجهالة على الطبيعة للمشروع
     وأنه قبلها بحالتها المتفق عليها,وأن الوحدة موضوع هذا العقد تحت الإنشاء.`;

    this.sevBand = `التنازل عن العقد:
    أتفق الطرفان على جواز قيام الطرف الثاني المشتري بحوالة الحجز للوحدة أو التنازل للأقارب من الدرجة الأولى أو للغير عن هذا العقد و ذلك بكافة شروط وأحكام التعاقد وذلك بعد موافقة كتابية مسبقة من الطرف الأول على هذا التحويل وسداد مصروفات التنازل للطرف الأول والمقررة بواقع (1%) من قيمة إجمالي ثمن الوحدة وذلك بالنسبة للأقارب من الدرجة الأولى وبواقع (7%) من قيمة إجمالي ثمن الوحدة في حالة التنازل للغير أو للطرف الأول.`;

    this.eightBand = `تسليم الشقة:
    يلتزم الطرف الأول بتسليم الطرف الثاني الوحدة محل التعاقد خلال ثلاث سنوات وستة أشهر من تاريخ العقد وبحد أقصى تسعون يوما من التاريخ المحدد وذلك بعد إخطاره بخطاب مسجل بعلم الوصول أو بالإعلان في إحدى الصحف اليومية ويحدد فيه اليوم المعين للإستلام والذي يتعين فيه حضور المشتري بشخصه أو من يوكله قانوناً للإستلام ، بشرط سداده للإقساط بإنتظام حتى تاريخ الإستلام ، وبصفة عامة يتم التسليم بعد بلوغ نسبة سداد (60)% من إجمالي ثمن الوحدة كحد أدنى و بموجب محضر إستلام موقع من الطرفين وفي جميع الأحوال يعتبر إستلام المشتري للوحدة محل التعاقد بمثابة قبول نهائي من جانب المشتري يسقط أي إدعاء يمس المواصفات و الإشتراطات المتعاقد عليها قبل الشركة ، ويتم التسليم بموجب محضر إستلام بحضور الطرف الثاني بشخصه أو وكيلاً عنه بوكالة رسمية.ويحق للطرف الثاني في حالة إنقضاء الأجل المحدد للتسليم تعليق سداد الأقساط المتبقية لحين إستيفاء تسليم الوحدة محل البيع.`;

    this.unitFloarText = ''

    this.secBandText = {
      fst: `موضوع العقد :
    بموجب هذا العقد وبكافة الضمانات الفعلية والقانونية باع وأسقط وتنازل الطرف الأول ( البائع ) إلى الطرف الثاني ( المشتري ) القابل لذلك فضلاً عن الالتزام بكافة شروط هذا العقد الأخرى ما هو
     الشقة السكنية رقم (`,
      sec: ` )
     الواقعة بالدور ( `,
      third: ` ) 
     من العمارة السكنية رقم ( `,
      four: ` )
     والبالغ مساحتها ( `,
      five: ` م2 ) 
     تحت العجز أو الزيادة,المقامة على قطعة الأرض رقم (25) بناحية جنوب مدينة نصر - إمتداد شارع حسن مأمون -  بالمشروع المسمى "مدينة نصر الجديدة" – قسم مدينة نصر – القاهرة. 
    وللشقة حق ارتفاق على الأجزاء المشتركة للعمارة وهي المدخل والسلم والمصعد ووصلات المياه الرئيسية والصرف الصحي والكهرباء ، وللشقة موضوع العقد حصة مشاع في الأرض المقام عليها العقار بنسبة مساحة الشقة مع نسبة مساحة باقي وحدات العقار.
    ومن المعلوم لدى الطرفين بأن مساحة الوحدة تقريبي ولا تأثير لذلك على سعر بيع الوحدة المحددة مسبقاً`}

    this.nineBand = `تكاليف الإدارة والصيانة
    يقر الطرف الثاني قبوله التام والغير مشروط على الإشتراك أو المساهمة في الشخص الإعتباري الذي سيتولى إدارة وصيانة ونظافة وأمن البرج – سواء عن طريقه مباشرة أو عن طريق الأجهزة أو الشركات المتخصصة ، ويلتزم في التاريخ المحدد للتسليم بسداد (5%) خمسة في المائة من إجمالي قيمة الشقة يحتفظ بها كوديعة في حساب هذا الشخص الإعتباري ويخصص العائد من إستثماره لتغطية الأغراض المخصصة من أجله وهي صيانة و أمن ونظافة العقار وبوجه عام كل ما من شأنه المحافظة على إستمرار أداء المنافع المشتركة للبرج على الوجه المطلوب ، ولا يجوز للمتعاقد التنصل منه بإعتباره مقرراً لصالحه ولصالح باقي ملاك العقار ويعتبر الإخلال به إخلالاً أساسياً بشروط هذا العقد.`

    this.tenBand = `تسجيل الوحدة:
    يتعهد الطرف الأول بالتوقيع على عقد بيع الوحدة النهائي لدى مصلحة الشهر العقاري أو الإقرار بصحة البيع والنفاذ لهذا العقد لدى القضاء وذلك لصالح الطرف الثاني المشتري وبرسوم ومصروفات يتحملها الطرف الثاني وحده.`

    this.elevenBand = `التنازل عن حق الشفعة:
    يقر الطرف الثاني بأنه قد تنازل صراحة عن حقه في المطالبة بالشفعة لأي وحدة من وحدات العمارة ويسرى هذا التنازل في حق ورثته من بعده وخلفه الخاص والعام وذلك إعمالا لنص المادة 948 (أ) من القانون المدني.`;

    this.elevenBand = `الموطن المختار:
    يقر الطرفان بصحة العنوان الخاص بهما الوارد قرين أسم كل منهما بصدر هذا العقد وأنه العنوان الذي يصح مخاطبتهما عليه قانونا ويلتزما بإخطار الطرف الأخر بموجب خطاب مسجل بعلم الوصول في حالة تغييره وإلا فإن أية مراسلات أو مخاطبات على العنوان المذكور بصدر هذا العقد كانت صحيحة ومنتجة لأثارها القانونية.`;

    this.therteenBand = `الاختصاص القضائي:
    تختص محاكم القاهرة الجديدة على اختلاف درجاتها وحدها بالنظر في أي نزاع قد ينشأ لا قدر الله بين طرفي التعاقد بسبب تنفيذ هذا العقد ، وذلك إذا لم يتوصل الطرفان إلى حل النزاع بالطريق الوديه وإجمالا كل ما ينشأ عنه بأي شكل من الأشكال.`

    this.fourteenBand = `تحرر هذا العقد من نسختين بيد كل طرف نسخه للعمل بموجبها عند اللزوم.`;

    this.coNameLast = `شركة / الريتاج لتقسيم الاراضي ( حاتم حسين علي )`;
  }



  setContractTexts() {

    if (this._unitService.contractInpts.unitNumber == undefined) {
      this._unitService.contractInpts.unitNumber = ' '
    };

    this.unitFloarText = ''
    let unNum = parseInt(this._unitService.contractInpts.unitNumber);

    if (unNum < 10) {
      this.unitFloarText = 'الارضى'
    };
    // towerInfo
    if (this._unitService.contractInpts.towerinfo == undefined) {
      this._unitService.contractInpts.towerinfo = ' '
    };
    // unitInfo
    if (this._unitService.contractInpts.unitExtent == undefined) {
      this._unitService.contractInpts.unitExtent = 0;
      this._unitService.contractInpts.unitTotalPrice = 0;
    };

    let totalStr = this._unitService.contractInpts.unitTotalPrice.toString();
    this.NumInwords = this.inArabicWords(totalStr);

    this.prepaidCashStr = '';
    this.prepaidCashInWords = '';

    this.remainCashStr = ''

    if (this._unitService.contractInpts.prepaidCash != undefined) {

      this.prepaidCashStr = this._unitService.contractInpts.prepaidCash.toString();
      this.prepaidCashInWords = this.inArabicWords(this.prepaidCashStr);
    } else if (this._unitService.contractInpts.prepaidCash == undefined) {
      this._unitService.contractInpts.prepaidCash = 0;
    };

    (this._unitService.contractInpts.remainCash != undefined) ?
      this.remainCashStr = this.inArabicWords(this._unitService.contractInpts.remainCash.toString()) :
      this._unitService.contractInpts.remainCash = 0

  };


  editSecText(show: string, hide: string) {
    $(hide).hide();
    $(show).show();
  };

  //days = ['السبت', 'الجمعة', 'الخميس', 'الاربعاء', 'الثلاثاء', 'الاثنين', 'الاحد',]

  clientNameChanged() {

    let clientInfo = this.clients.find(client => client.clientName == this._unitService.contractInpts.clientName)

    if (clientInfo != undefined) {

      if (this._unitService.contractInpts.clientName != null && this._unitService.contractInpts.clientName != '' && this._unitService.contractInpts.clientName != undefined) {
        this._unitService.contractInpts.clientNationNum = clientInfo.clientNationNum;
        this._unitService.contractInpts.clientAdress = clientInfo.clientAddress;
        this._unitService.contractInpts.clientTell = clientInfo.clientTell;
        // validation
        this._unitService.contractVaildInpts.clientNameVaild = false;
        $('#clientName_contract').removeClass('is-invalid');
        this.contractVaild = false;
      };

    } else {

      this._unitService.contractVaildInpts.clientNameVaild = true;

      // validation massage check
      if (this._unitService.contractInpts.clientName == null || this._unitService.contractInpts.clientName == '') {
        this._unitService.contractVaildInpts.clientNameMsg = 'يجب ادخال اسم العميل'
      } else {
        this._unitService.contractVaildInpts.clientNameMsg = 'اسم العميل غير صحيح';
      };

      this._unitService.contractInpts.clientNationNum = null;
      this._unitService.contractInpts.clientAdress = null;
      this._unitService.contractInpts.clientTell = null;
      $('#clientName_contract').addClass('is-invalid');

      this.contractVaild = true;
    };

  };

  towerinfoChanged() {

    let towerinfo = this._unitService.towerInfoArr.find(tower => tower.name == this._unitService.contractInpts.towerinfo);

    if (towerinfo != undefined) {

      if (this._unitService.contractInpts.towerinfo != null && this._unitService.contractInpts.towerinfo != '' && this._unitService.contractInpts.towerinfo != undefined) {

        this.filteredUnits = this.units.filter(unit => unit.towerId == towerinfo.id);
        // validation
        this._unitService.lockedInputs.unitLocked = false;
        this._unitService.contractVaildInpts.towerinfoVaild = false;
        $('#towerinfo').removeClass('is-invalid');
        this.contractVaild = false;

      } else {
        this._unitService.lockedInputs = {
          unitLocked: true,
          prepaidPercLocked: true,
        };
        this._unitService.contractInpts.unitNumber = null;
      };
      this.contractVaild = true;

    } else {

      if (this._unitService.contractInpts.towerinfo == undefined || this._unitService.contractInpts.towerinfo == null) {
        this._unitService.contractVaildInpts.towerinfoMsg = 'يجب ادخال اسم البرج';
      } else {
        this._unitService.contractVaildInpts.towerinfoMsg = 'اسم البرج غير صحيح';
      };

      this._unitService.contractVaildInpts.towerinfoVaild = true;
      $('#towerinfo').addClass('is-invalid');

      this._unitService.lockedInputs = {
        unitLocked: true,
        prepaidPercLocked: true,
      };

      this._unitService.contractInpts.unitNumber = null;
      this.contractVaild = true;
    };

  };

  checkArr: any[];
  fstCheckArr: any[];
  secCheckArr: any[];

  unitNumberChanged() {

    let unitInfo: UnitData;

    if (this.filteredUnits != undefined) {
      unitInfo = this.filteredUnits.find(unit => unit.unitNum == this._unitService.contractInpts.unitNumber);
    };

    if (unitInfo != undefined) {

      if (this._unitService.contractInpts.unitNumber != null && this._unitService.contractInpts.unitNumber != '' && this._unitService.contractInpts.unitNumber != undefined) {
        // unlock prepaidPerc
        this._unitService.lockedInputs.prepaidPercLocked = false;
        this._unitService.contractVaildInpts.unitNumberVaild = false;
        // post unitsVals to thr table
        this._unitService.contractInpts.unitPrice = unitInfo.unitPrice;
        this._unitService.contractInpts.unitExtent = unitInfo.unitExtent;
        this._unitService.contractInpts.unitTotalPrice = unitInfo.unitPrice * unitInfo.unitExtent;
        this.contractVaild = false;
      } else {
        this._unitService.lockedInputs.prepaidPercLocked = true;
        /* this._unitService.contractVaildInpts.unitNumberVaild = true;

        this._unitService.contractVaildInpts.unitNumberMsg = 'غير صحيح' */
        // reset vals
        this._unitService.contractInpts.prepaidPerc = null;
        // reset results vals
        this._unitService.contractInpts.unitPrice = null;
        this._unitService.contractInpts.unitExtent = null;
        this._unitService.contractInpts.unitTotalPrice = null;
        this._unitService.contractInpts.checkQtys = null;
        this._unitService.contractInpts.dateBegain = '';
        this.checkArr = [];
        this.contractVaild = true;
      };

    } else {

      if (this._unitService.lockedInputs.unitLocked == false) {

        this._unitService.lockedInputs.prepaidPercLocked = true;
        this._unitService.contractVaildInpts.unitNumberVaild = true;

        if (this._unitService.contractInpts.unitNumber == undefined || this._unitService.contractInpts.unitNumber == '') {
          this._unitService.contractVaildInpts.unitNumberMsg = 'يجب الادخال'
        } else {
          this._unitService.contractVaildInpts.unitNumberMsg = 'غير صحيح'
        };

        // reset vals
        this._unitService.contractInpts.prepaidPerc = null;
        // reset results vals
        this._unitService.contractInpts.unitPrice = null;
        this._unitService.contractInpts.unitExtent = null;
        this._unitService.contractInpts.unitTotalPrice = null;
        this._unitService.contractInpts.checkQtys = null;
        this._unitService.contractInpts.dateBegain = '';
        this.contractVaild = true;
      } else {
        this._unitService.contractVaildInpts.unitNumberVaild = false;
        this.contractVaild = true;
      };

    };

    this.setContractTexts();

    if (this._unitService.contractInpts.dateBegain != undefined) this.checkQtysChanged()

  };

  prepaidPercChanged() {

    if (this._unitService.lockedInputs.unitLocked == false) {

      if (this._unitService.contractInpts.prepaidPerc != null && this._unitService.contractInpts.prepaidPerc != undefined) {
        // results
        this._unitService.contractInpts.prepaidCash = Math.floor((this._unitService.contractInpts.unitTotalPrice * this._unitService.contractInpts.prepaidPerc) / 100);
        this._unitService.contractInpts.remainCash = this._unitService.contractInpts.unitTotalPrice - this._unitService.contractInpts.prepaidCash;
        this._unitService.contractVaildInpts.prepaidPercVaild = false;
        this.contractVaild = false;
      } else {
        this._unitService.contractInpts.prepaidCash = null;
        this._unitService.contractInpts.remainCash = null;
        this._unitService.contractVaildInpts.prepaidPercVaild = true;
        this._unitService.contractVaildInpts.prepaidPercMsg = 'يجب الادخال'
        this.contractVaild = true;
      };

    } else {
      this._unitService.contractVaildInpts.prepaidPercVaild = false;
      this.contractVaild = true;
    };

    this.setContractTexts();
    if (this._unitService.contractInpts.dateBegain != undefined) this.checkQtysChanged()

  };



  getDates = function (startDate, endDate) {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };

    for (let i = 0; i < endDate; i++) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 90);
    };

    /* while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 90);
    } */
    return dates;
  };

  checkQtysChanged() {

    this.checkArr = [];
    this.fstCheckArr = [];
    this.secCheckArr = [];

    if (this._unitService.lockedInputs.unitLocked == false) {

      if (this._unitService.contractInpts.checkQtys != null && this._unitService.contractInpts.checkQtys != undefined) {
        this._unitService.contractInpts.checksValue = Math.floor(this._unitService.contractInpts.remainCash / this._unitService.contractInpts.checkQtys);
        this._unitService.contractVaildInpts.checkQtysVaild = false;
        this.contractVaild = false;
      } else {
        this._unitService.contractVaildInpts.checkQtysVaild = true;
        this._unitService.contractVaildInpts.checkQtysMsg = 'يجب الادخال';
        this.contractVaild = true;
      };

    } else {
      this._unitService.contractVaildInpts.checkQtysVaild = false;
      this.contractVaild = true;
    };

    let dates = []


    if (this._unitService.contractInpts.dateBegain != undefined && this._unitService.contractInpts.dateBegain != '') {
      dates = this.getDates(new Date(this._unitService.contractInpts.dateBegain), this._unitService.contractInpts.checkQtys);
      for (let i = 0; i < this._unitService.contractInpts.checkQtys; i++) {
        let dateStr: string;

        let month: string = '';
        let day: string = '';

        (dates[i].getMonth().toString().length < 2) ? month = `0${dates[i].getMonth() + 1}` : month = `${dates[i].getMonth() + 1}`;
        (dates[i].getDate().toString().length < 2) ? day = `0${dates[i].getDate()}` : day = `${dates[i].getDate()}`;

        dateStr = `${dates[i].getFullYear()}-${month}-${day}`
        this.checkArr = [...this.checkArr, { serial: i + 1, val: this._unitService.contractInpts.checksValue, date: dateStr }];
      };
    };


    let datesArr = [];

    this.fstCheckArr = this.checkArr.slice(0, Math.ceil(this._unitService.contractInpts.checkQtys / 2))
    this.secCheckArr = this.checkArr.slice(Math.ceil(this._unitService.contractInpts.checkQtys / 2))
  };

  dateArr: any[];

  dateBegainChanged() {

    var getDates = function (startDate, endDate) {
      var dates = [],
        currentDate = startDate,
        addDays = function (days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };

      for (let i = 0; i < endDate; i++) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 90);
      };

      /* while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 90);
      } */
      return dates;
    };

    // Usage
    var dates = getDates(new Date('2013-10-22'), 12);
    let datesArr = [];
    let d = new Date('Mon Jan 20 2014 02:00:00 GMT+0200 (Eastern European Standard Time)')

    dates.forEach(function (date) {
      datesArr = [...datesArr, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`]
    });

  };

  addNewContract() {
    // validation Methods
    this.clientNameChanged();
    this.towerinfoChanged();
    this.checkQtysChanged();
    this.unitNumberChanged();
    this.prepaidPercChanged();

    if (this.contractVaild == false) {

      let clientInfo: ClientsData = this.clients.find(client => client.clientName == this._unitService.contractInpts.clientName);
      let unitInfo: UnitData = this.filteredUnits.find(unit => unit.unitNum == this._unitService.contractInpts.unitNumber);
      let towerinfo: TowerData = this._unitService.towerInfoArr.find(tower => tower.name == this._unitService.contractInpts.towerinfo);

      this.contractData = {
        contractId: null, //number;
        // unit and client information
        clientId: clientInfo.clientId, //number;
        unitId: unitInfo.unitId, //number;
        towerId: towerinfo.towerId, //number;
        // price
        prepaidCash: this._unitService.contractInpts.prepaidCash, //number;
        remainCash: this._unitService.contractInpts.remainCash, //number;
        // if there are checks
        checkValue: this._unitService.contractInpts.checksValue, //number;
        checksQty: this._unitService.contractInpts.checkQtys, //number;
      };
    };

  };

};
