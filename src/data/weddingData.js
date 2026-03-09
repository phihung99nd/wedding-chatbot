const albumImageModules = import.meta.glob(
  '../assets/album/wed_pic/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true, import: 'default' }
);

const albumImagesFromAssets = Object.entries(albumImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export const couple = {
  groomName: 'Trần Thái Dương',
  brideName: 'Nguyễn Khánh Linh',
  groomDadName: '???',
  groomMomName: '???',
  brideDadName: '???',
  brideMomName: '???',
  date: 'Ngày 28 tháng 03 năm 2026',
  time: '11:00 Sáng',
  venueName: 'Queen Bee Luxury',
  venueAddress: '20 Láng Hạ - Phường Láng - Hà Nội',
  venueMapsUrl:
    'https://maps.app.goo.gl/56thoXT8nGCps2odA',
  dressCode: 'Trang phục tông nhẹ nhàng, thanh lịch (pastel, be, trắng kem).',
  rsvpEmail: 'rsvp@ameliaandliam.com',
  rsvpSheetUrl:
    'https://docs.google.com/spreadsheets/d/YOUR_RSVP_SHEET_ID_HERE/edit?usp=sharing',
  rsvpFormEndpoint: '',
  wishesLink: 'https://example.com/send-wishes',
  giftInfo:
    'Sự hiện diện của bạn đã là món quà quý giá nhất. Nếu vẫn muốn gửi mừng cưới, bạn có thể chuyển khoản theo thông tin bên dưới để góp phần xây dựng tổ ấm nhỏ của Dương & Linh.',
  bankDetails: 'STK: XXXX XXXX XXXX · Ngân hàng: ABC',
  giftQrUrl:
    'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Tran%20Thai%20Duong%20%26%20Nguyen%20Khanh%20Linh%20Wedding%20Gift',
  albumImages: albumImagesFromAssets
};

export const autoMessages = [
  {
    id: 'welcome-1',
    sender: 'bot',
    text: `Xin chào, chào mừng bạn đến với đám cưới của ${couple.groomName} & ${couple.brideName}.`
  },
  {
    id: 'welcome-2',
    sender: 'bot',
    text: 'Cuộc trò chuyện nhỏ này sẽ nhẹ nhàng dẫn bạn đi qua câu chuyện tình yêu và mọi thông tin của ngày trọng đại.'
  },
  {
    id: 'bride-1',
    sender: 'bot',
    text: `Trước tiên, hãy gặp cô dâu ${couple.brideName} - là một fangirl cuồng nhiệt của RHYDER. RHYDER (tên thật Nguyễn Quang Anh, sinh năm 2001) là nam ca sĩ, rapper và nhà sản xuất âm nhạc nổi tiếng người Việt Nam. Anh nổi danh từ năm 2013 khi giành Quán quân Giọng hát Việt nhí mùa đầu tiên, sau đó tái xuất ấn tượng tại Rap Việt mùa 3 (2023) và đạt Á quân chương trình Anh trai "say hi" (2024).`
  },
  {
    id: 'groom-1',
    sender: 'bot',
    text: `Chú rể ${couple.groomName} - một kỹ sư bảo mật chuyên đóng mọi “cổng” nguy hiểm, nhưng lại mở trọn trái tim cho cô dâu. Đam mê cầu lông để rèn phản xạ, tập Kendo để giữ tinh thần samurai, và sắp tới sẽ học thêm kỹ năng mới: làm chồng chuẩn chỉnh.`
  },
  {
    id: 'story-1',
    sender: 'bot',
    text: 'Họ gặp nhau vào một chiều mùa hè tại quán boardgame, khi chú rể đang còn đèo cô gái khác, nước mắt cô dâu rơi, trò chơi kết thúc. Giờ đây, họ mời bạn đứng bên cạnh, chứng kiến khoảnh khắc họ hứa với nhau về tất cả những ngày mai.'
  },
  {
    id: 'when-where-1',
    sender: 'bot',
    type: 'dateVenue',
    text: `Hôn lễ sẽ diễn ra vào ${couple.date} lúc ${couple.time}, tại ${couple.venueName}.\nĐịa chỉ: ${couple.venueAddress}`
  },
  // {
  //   id: 'dresscode-1',
  //   sender: 'bot',
  //   type: 'dresscode',
  //   text: `Trang phục gợi ý: ${couple.dressCode}`
  // },
  {
    id: 'rsvp-1',
    sender: 'bot',
    type: 'rsvpForm',
    text: 'Bạn có thể xác nhận tham dự ngay bên dưới. Vui lòng điền thông tin:'
  },
  // {
  //   id: 'gifts-1',
  //   sender: 'bot',
  //   type: 'gifts',
  //   text: couple.giftInfo
  // },
  // {
  //   id: 'gifts-2',
  //   sender: 'bot',
  //   type: 'gifts-details',
  //   text: couple.bankDetails
  // },
  // {
  //   id: 'gifts-qr',
  //   sender: 'bot',
  //   type: 'gifts-qr',
  //   text: 'Nếu tiện hơn, bạn cũng có thể gửi mừng cưới bằng cách quét mã QR dưới đây. Dương & Linh chân thành cảm ơn tấm lòng của bạn.'
  // },
  {
    id: 'closing-1',
    sender: 'bot',
    text: 'Cảm ơn bạn vì đã là một phần trong câu chuyện của Dương & Linh. Ngày hôm đó sẽ không trọn vẹn nếu thiếu bạn. Chúng mình rất mong được gặp bạn và cùng nhau nâng ly trong ngày 28.03.2026.'
  }
];

export const quickReplies = [
  {
    id: 'lovestory',
    label: 'Câu chuyện tình yêu của Dương & Linh',
    question: 'Câu chuyện tình yêu của Dương & Linh',
    answer: 'Họ gặp nhau vào một chiều mùa hè tại quán boardgame, khi chú rể đang còn đèo cô gái khác, nước mắt cô dâu đã rơi, trò chơi kết thúc.'
  },
  {
    id: 'when',
    label: 'Đám cưới diễn ra khi nào?',
    question: 'Đám cưới diễn ra khi nào?',
    answer: `Đám cưới sẽ diễn ra vào ${couple.date}, bắt đầu lúc ${couple.time}.`
  },
  {
    id: 'where',
    label: 'Địa điểm tổ chức ở đâu?',
    question: 'Địa điểm tổ chức ở đâu?',
    answer: `Buổi lễ sẽ được tổ chức tại ${couple.venueName}, địa chỉ ${couple.venueAddress}.`,
    type: 'venue'
  },
  {
    id: 'dresscode',
    label: 'Trang phục gợi ý là gì?',
    question: 'Trang phục gợi ý là gì?',
    answer: couple.dressCode
  },
  {
    id: 'rsvp-form',
    label: 'Mình muốn xác nhận tham dự',
    question: 'Mình muốn xác nhận tham dự ngay bây giờ.',
    answer: 'Bạn vui lòng điền thông tin xác nhận tham dự tại form bên dưới nhé.',
    type: 'rsvpForm'
  },
  {
    id: 'gifts',
    label: 'Thông tin mừng cưới',
    question: 'Mình có thể gửi mừng cưới như thế nào?',
    answer: `${couple.giftInfo} Thông tin chuyển khoản: ${couple.bankDetails}`,
    type: 'gifts',
    showGiftQr: true
  },
  {
    id: 'album',
    label: 'Xem album ảnh cưới',
    question: 'Cho mình xem album ảnh cưới nhé!',
    answer: 'Dưới đây là một vài khoảnh khắc tiêu biểu của Dương & Linh. Hãy bấm vào từng ảnh để xem nhé!',
    type: 'album'
  }
];

