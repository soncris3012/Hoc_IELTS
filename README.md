# Hoc_IELTS - Official Computer-Delivered IELTS Simulation Platform

> Nền tảng mô phỏng kỳ thi IELTS trên máy tính (Computer-Delivered IELTS - CDT) chuẩn quốc tế, lấy cảm hứng từ giao diện thi thật của IDP/British Council và YouPass.vn. Tích hợp bộ công cụ bóc tách đề thi tự động và chấm thi bằng AI.

---

## 🌟 Điểm nổi bật & Tính năng cốt lõi

### 1. Phân hệ Phòng thi Chuẩn IELTS (UI/UX CDT)
- **Top Bar Thông minh**:
  - Thông tin thí sinh: Candidate Name, Candidate Number.
  - Đồng hồ đếm ngược động (Countdown Timer) với nút **Ẩn / Hiện (Hide/Show)** và cảnh báo đổi màu khi còn dưới 10 phút / 5 phút.
  - Nút **Help** mở hướng dẫn quy chế & phím tắt phòng thi.
  - Nút **Settings**: Tùy chỉnh cỡ chữ (**Standard / Large / Extra Large**) và 3 bộ phối màu chuẩn (**Black on White**, **White on Black / Dark Mode**, **Yellow on Black / High Contrast Accessibility**).
  - Nút **Finish Test** kèm modal kiểm tra số câu chưa làm trước khi xác nhận nộp bài.
- **Main Workspace Resizable**:
  - Thanh phân chia ngang (**Draggable Divider**) cho phép kéo thả tùy chỉnh độ rộng 2 bên mượt mà.
  - Cột trái: Bài đọc Reading Passage / Đề bài Writing (thanh cuộn độc lập).
  - Cột phải: Khung làm bài Questions / Textarea Writing (thanh cuộn độc lập).
  - Chế độ Listening: Giao diện toàn màn hình kèm trình phát Audio Bar tích hợp (Play, Pause, Mute).
- **Highlighter & Note Engine**:
  - Chọn/bôi đen bất kỳ đoạn văn nào trên bài đọc hoặc câu hỏi.
  - Context menu nổi với 2 tùy chọn: **Highlight** (màu vàng) và **Note** (màu xanh dương kèm Sticky Note popover).
  - Bấm vào highlight để sửa ghi chú, xóa highlight hoặc xóa toàn bộ highlight trong bài đọc.
- **Bottom Navigation Palette**:
  - Thanh điều hướng cố định chia theo từng Part (Part 1, Part 2, Part 3).
  - 40 ô số tương ứng 40 câu hỏi thi với đầy đủ 4 trạng thái:
    - *Chưa làm* (màu xám / viền nhạt)
    - *Đã trả lời* (tô đậm / gạch chân)
    - *Câu hiện tại* (viền xanh sáng)
    - *Đánh dấu xem lại* (chấm cam nổi bật kích hoạt qua checkbox **Review**)
  - Nhấp vào ô số bất kỳ để tự động cuộn mượt đến đúng vị trí câu hỏi.

---

### 2. Cấu trúc Dữ liệu & Engine Chấm điểm Đa dạng
- **Hỗ trợ toàn diện các dạng câu hỏi IELTS**:
  - `tfng` & `ynng`: True / False / Not Given & Yes / No / Not Given.
  - `mcq_single`: Trắc nghiệm 1 đáp án (A, B, C, D).
  - `mcq_multiple`: Chọn nhiều đáp án (ví dụ: "Choose TWO letters" với cơ chế giới hạn số lựa chọn).
  - `gap_fill`: Điền từ vào chỗ trống nhúng trực tiếp trong câu, đoạn tóm tắt hoặc bảng.
  - `matching_headings`: Nối tiêu đề đoạn văn A, B, C... với danh sách số La Mã (i, ii, iii...).
  - `matching_information`: Nối thông tin với chữ cái A-G bằng menu dropdown.
- **Smart Answer Comparison Engine**:
  - Tự động chuẩn hóa đáp án (loại bỏ khoảng trắng thừa, không phân biệt hoa thường).
  - Hỗ trợ đáp án tùy chọn trong ngoặc đơn (ví dụ: `(the) car` chấp nhận cả `car` lẫn `the car`).
  - Hỗ trợ các từ đồng nghĩa/viết tắt ngăn cách bởi dấu `/` (ví dụ: `color/colour` hay `15/fifteen`).
- **Thang điểm & Review Mode**:
  - Tự động quy đổi điểm thô (Raw Score / 40) sang điểm **IELTS Band Score (1.0 - 9.0)** chính thức.
  - Dashboard tổng kết chi tiết: Band Score, độ chính xác theo dạng câu hỏi, thời gian làm bài, phân tích từng Part.
  - **Detailed Solution View**: Hiển thị đáp án của thí sinh, đáp án chính xác, lời giải thích cặn kẽ và **trích dẫn câu bằng chứng trong bài đọc (Evidence Quote)**.

---

### 3. Công cụ Bóc tách Đề thi & AI Examiner
- **Admin Studio (`/admin/import`)**:
  - Bộ nạp sẵn đề chuẩn Cambridge 18 Academic Reading Test 1 (40 câu) & Listening Test 1 chỉ với 1 click.
  - Hỗ trợ dán văn bản thô / HTML từ tài liệu Cambridge IELTS 1-19.
  - Tích hợp API Gemini (`/api/ai/parse-exam`) để tự động chuyển đổi văn bản thô sang JSON Schema chuẩn.
- **AI Writing Examiner (`/writing`)**:
  - Mô phỏng phòng thi IELTS Writing CDT với đồng hồ và bộ đếm từ trực tiếp (**Live Word Counter** kèm cảnh báo khi chưa đủ 150/250 từ).
  - Chấm bài theo 4 tiêu chí chuẩn IELTS:
    1. *Task Achievement / Task Response*
    2. *Coherence and Cohesion*
    3. *Lexical Resource*
    4. *Grammatical Range and Accuracy*
  - Chỉ ra lỗi ngữ pháp, gợi ý từ vựng học thuật nâng cao và cung cấp **Bài mẫu Band 8.5+**.

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS với custom variables cho 3 theme phòng thi IELTS
- **Quản lý trạng thái**: Zustand với middleware `persist` (lưu trữ `localStorage`, làm mới trang không mất bài làm hay highlight)
- **Database**: Supabase (PostgreSQL) hỗ trợ lưu bài thi, lịch sử làm bài và bài nộp writing.
- **Deployment**: Tương thích 100% với Vercel và Supabase.

---

## 🚀 Hướng dẫn Cài đặt & Chạy cục bộ

```bash
# 1. Clone repo
git clone https://github.com/soncris3012/Hoc_IELTS.git
cd Hoc_IELTS

# 2. Cài đặt dependencies
npm install

# 3. Tạo file cấu hình môi trường (tùy chọn)
cp .env.example .env.local

# 4. Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt tại: `http://localhost:3000`

---

## ☁️ Hướng dẫn Triển khai (Vercel & Supabase)

### 1. Triển khai lên Vercel
1. Đăng nhập vào [Vercel](https://vercel.com/) và bấm **Add New Project**.
2. Chọn repo `Hoc_IELTS` từ GitHub của bạn (`soncris3012/Hoc_IELTS`).
3. Trong mục **Environment Variables**, cấu hình các biến (tùy chọn):
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase của bạn.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key của Supabase.
   - `GEMINI_API_KEY`: API key của Google AI Studio (để kích hoạt AI chấm bài & bóc tách đề).
4. Bấm **Deploy**. Vercel sẽ tự động build và cấp phát tên miền miễn phí.

### 2. Cấu hình Database Supabase
1. Tạo một project mới tại [Supabase](https://supabase.com/).
2. Vào mục **SQL Editor**, mở file [`supabase/schema.sql`](supabase/schema.sql) trong repo và dán toàn bộ nội dung vào rồi bấm **Run**.
3. Copy **Project URL** và **anon public key** từ mục `Settings -> API` và điền vào `.env.local` hoặc Vercel Environment Variables.
> *Lưu ý: Ứng dụng có cơ chế tự động Fallback về LocalStorage nên bạn vẫn có thể trải nghiệm toàn bộ tính năng mà không bắt buộc phải cài đặt Supabase ngay lập tức.*

---

## 📁 Cấu trúc Thư mục Dự án

```
Hoc_IELTS/
├── supabase/
│   └── schema.sql                # DDL Database cho Supabase (tests, attempts, writing)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Phòng thi IELTS CDT (Reading & Listening)
│   │   ├── writing/page.tsx      # Phòng thi IELTS Writing CDT & AI Examiner
│   │   ├── admin/import/page.tsx # Admin Studio: Import & Parse đề thi
│   │   └── api/ai/
│   │       ├── grade-writing/    # API Route chấm Writing theo 4 tiêu chí
│   │       └── parse-exam/       # API Route bóc tách đề bằng Gemini Structured Output
│   ├── components/exam/
│   │   ├── TopBar.tsx            # Header, Timer, Help, Settings, Submit
│   │   ├── ResizableSplitPane.tsx# Màn hình chia đôi kéo thả tỉ lệ
│   │   ├── PassagePane.tsx       # Hiển thị bài đọc & tương tác Highlight/Note
│   │   ├── QuestionsPane.tsx     # Bộ render 6 loại câu hỏi IELTS
│   │   ├── BottomPalette.tsx     # Bảng 40 câu hỏi, trạng thái & điều hướng
│   │   ├── HighlightMenu.tsx     # Toolbar nổi khi bôi đen chữ
│   │   ├── StickyNoteModal.tsx   # Cửa sổ ghi chú dính của thí sinh
│   │   ├── ReviewResultDashboard.tsx # Trang kết quả, Band score & giải chi tiết
│   │   ├── SettingsModal.tsx     # Tùy chọn giao diện (Font size & Themes)
│   │   ├── HelpModal.tsx         # Modal hướng dẫn phòng thi
│   │   └── SubmitConfirmModal.tsx# Modal xác nhận nộp bài
│   ├── data/
│   │   ├── mockReadingTest.ts    # Đề thi Reading 40 câu chuẩn Cambridge 18
│   │   ├── mockListeningTest.ts  # Đề thi Listening kèm audio track
│   │   └── mockWritingTest.ts    # Đề thi Writing Task 1 & Task 2
│   ├── lib/
│   │   ├── bandCalculator.ts     # Bộ so khớp đáp án & quy đổi Band Score 1.0-9.0
│   │   ├── store.ts              # Zustand Store với LocalStorage Persistence
│   │   └── supabase.ts           # Supabase Client & LocalStorage fallback
│   └── types/
│       └── ielts.ts              # Type definitions toàn diện
├── .env.example
├── vercel.json
└── package.json
```
