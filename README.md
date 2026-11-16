# Shop DevOps — dự án thực hành DevOps với web bán hàng

Một web bán hàng nhỏ nhưng có cấu trúc giống dự án thật, để bạn luyện **Linux, Docker, Git, CI/CD**.

## Kiến trúc

```
Trình duyệt ──► Nginx (frontend container, :8080)
                 ├─ file tĩnh React (Vite build)
                 └─ /api/*  ──proxy──► Backend (Node/Express, :3000) ──► PostgreSQL (:5432)
```

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| frontend | React + Vite, phục vụ bằng Nginx | Giao diện: sản phẩm, giỏ hàng, đăng nhập, đơn hàng |
| backend | Node.js + Express | REST API, JWT auth, validate bằng zod |
| database | PostgreSQL 16 | users, products, orders, order_items |
| CI/CD | GitHub Actions + GHCR | Test, build image, deploy qua SSH |

### Cấu trúc backend (phân lớp như dự án thật)

```
routes → controllers → services → repositories → database
 (URL)    (HTTP in/out) (nghiệp vụ)   (chỉ SQL)
```
Kèm `middlewares/` (auth JWT, validate, xử lý lỗi), `config/` (biến môi trường), `db/migrations/` (schema theo phiên bản).

### API

| Method | Đường dẫn | Quyền | Mô tả |
|---|---|---|---|
| GET | `/api/health` | public | Liveness check |
| GET | `/api/ready` | public | Readiness check (kiểm tra DB) |
| POST | `/api/auth/register` | public | Đăng ký |
| POST | `/api/auth/login` | public | Đăng nhập, trả JWT |
| GET | `/api/auth/me` | user | Thông tin tài khoản |
| GET | `/api/products?q=&page=` | public | Danh sách / tìm kiếm sản phẩm |
| GET | `/api/products/:id` | public | Chi tiết sản phẩm |
| POST | `/api/products` | admin | Thêm sản phẩm |
| POST | `/api/orders` | user | Đặt hàng (transaction, trừ kho) |
| GET | `/api/orders/mine` | user | Đơn hàng của tôi |

## Bắt đầu nhanh (chỉ cần Docker)

```bash
cp .env.example .env              # sửa mật khẩu và JWT_SECRET
docker compose up --build -d      # build và chạy 3 container
docker compose exec backend node src/db/seed.js   # nạp dữ liệu mẫu
```
Mở http://localhost:8080. Tài khoản admin mẫu: `admin@shop.local` / `Admin@123`.

Lệnh hay dùng:
```bash
docker compose ps                 # trạng thái container
docker compose logs -f backend    # xem log
docker compose exec db psql -U shop -d shop   # vào database
docker compose down               # dừng (giữ dữ liệu)
docker compose down -v            # dừng và XÓA dữ liệu
```

## Chạy ở chế độ dev (không build lại image)

```bash
docker compose up -d db                    # chỉ chạy DB
cd backend && npm install && npm run migrate && npm run seed && npm run dev
cd frontend && npm install && npm run dev  # http://localhost:5173
```

## Bước đầu tiên khi bắt đầu với Git

```bash
cd shop-devops
git init -b main
# Tạo package-lock.json (CI dùng `npm ci` cần file này) rồi commit cả hai
(cd backend && npm install) && (cd frontend && npm install)
git add . && git commit -m "feat: initial commit"
```
Tạo repo trên GitHub, rồi `git remote add origin ... && git push -u origin main`.

## Lộ trình thực hành gợi ý

**1. Git** — Làm việc theo nhánh: `git switch -c feature/xxx` → commit nhỏ → push → mở Pull Request → CI chạy → merge. Thử tạo conflict rồi tự giải quyết; thử `git rebase -i`, `git revert`, `git tag`.

**2. Docker**
- Đọc 2 Dockerfile: multi-stage build, chạy non-root, HEALTHCHECK, `.dockerignore`.
- Chạy `docker image ls` so sánh dung lượng image. Thử bỏ multi-stage xem image to ra bao nhiêu.
- Thử `docker compose down` rồi `up` lại: dữ liệu còn không? Vì sao (volume)?
- Tắt container `db`, gọi `/api/ready` xem điều gì xảy ra.

**3. Linux** — Thuê 1 VPS rẻ (hoặc VM/WSL), thực hành: SSH key, `ufw` chỉ mở 22/80/443, tạo user `deploy` không phải root, cài Docker, xem log bằng `journalctl`/`docker logs`, theo dõi tài nguyên bằng `htop`, `df -h`, `ss -tlnp`.

**4. CI/CD**
- `ci.yml`: chạy test + migration trên Postgres thật, build image mỗi lần push/PR.
- `deploy.yml`: khi `git tag v1.0.0 && git push --tags` → build image, đẩy lên GHCR, SSH vào server `docker compose pull && up -d`.
- Secrets cần tạo trong GitHub (Settings → Secrets): `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `GHCR_TOKEN` (PAT quyền `read:packages`).
- Trên server: `mkdir -p /opt/shop` và tạo file `/opt/shop/.env` từ `.env.example` (không commit!).
- Thử làm CI **fail** có chủ đích (sửa test sai) để xem PR bị chặn merge như thế nào; bật Branch protection cho `main`.

## Bài tập nâng cao

1. Thêm HTTPS: Caddy hoặc Nginx + Let's Encrypt (certbot) trước frontend.
2. Thêm lint (ESLint) và test cho frontend vào CI.
3. Backup Postgres bằng `pg_dump` + cron, thử restore.
4. Thêm Prometheus + Grafana hoặc chỉ cần `docker stats` + log tập trung.
5. Thêm môi trường staging (compose riêng, deploy khi merge vào `develop`).
6. Viết thêm migration `002_...sql` (ví dụ thêm bảng categories) và xem pipeline áp dụng nó ra sao.
7. Thay SSH deploy bằng Kubernetes (k3s) khi đã quen Docker.

## Lỗi thường gặp

- **Port 8080/5432 đã bị chiếm**: đổi cổng bên trái trong `ports:` của `docker-compose.yml`.
- **`npm ci` fail trong CI**: chưa commit `package-lock.json`.
- **Backend khởi động lỗi `JWT_SECRET must be set`**: thiếu biến môi trường trong `.env`.
- **Sửa code mà web không đổi**: quên `--build` khi `docker compose up`.
# shop-devops
