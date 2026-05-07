# CRUD Module Pattern

Stack: **Colyseus** (better-call router) · **Mongoose** · **Zod** · **TypeScript**

---

## Cấu trúc thư mục

```
src/modules/<module>/
├── enums/
│   └── <module>.enum.ts
├── models/
│   └── <module>.model.ts
├── validators/
│   └── <module>.validator.ts
├── services/
│   └── <module>.service.ts
└── routes/
    └── <module>.router.ts
```

---

## 1. Enum

Key luôn **IN HOA**.

```ts
// src/modules/foo/enums/foo.enum.ts
export enum FooStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}
```

---

## 2. Model

```ts
// src/modules/foo/models/foo.model.ts
import { FooStatus } from "@/modules/foo/enums/foo.enum.js";
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFoo extends Document {
    userId: Types.ObjectId;
    name: string;
    status: FooStatus;
    createdAt: Date;
    updatedAt: Date;
}

const FooSchema = new Schema<IFoo>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true, trim: true },
        status: { type: String, enum: Object.values(FooStatus), default: FooStatus.ACTIVE },
    },
    { timestamps: true }
);

export const FooModel = mongoose.model<IFoo>("Foo", FooSchema);
```

> Sub-document (JSON field) dùng Schema riêng với `{ _id: false }`.
>
> ```ts
> const FooStatsSchema = new Schema<IFooStats>(
>     { hp: { type: Number, default: 1000 } },
>     { _id: false }
> );
> ```

---

## 3. Validator

```ts
// src/modules/foo/validators/foo.validator.ts
import { z } from "zod";
import { FooStatus } from "@/modules/foo/enums/foo.enum.js";

export const CreateFooSchema = z.object({
    name: z.string().min(1).max(64),
});

export const UpdateFooSchema = z.object({
    name: z.string().min(1).max(64).optional(),
    status: z.enum([FooStatus.ACTIVE, FooStatus.INACTIVE]).optional(),
});

export const FooIdSchema = z.object({
    id: z.string().min(1),
});
```

---

## 4. Service

- Mọi method nhận `userId: Types.ObjectId` — lấy từ JWT context.
- Filter theo `userId` để user chỉ thao tác dữ liệu của mình.
- Update dùng `$set` với dot-notation cho nested field.

```ts
// src/modules/foo/services/foo.service.ts
import { FooModel } from "@/modules/foo/models/foo.model.js";
import { FooStatus } from "@/modules/foo/enums/foo.enum.js";
import { Types } from "mongoose";

export class FooService {
    async create(userId: Types.ObjectId, name: string) {
        const doc = await FooModel.create({ userId, name });
        return doc.toObject();
    }

    async getAll(userId: Types.ObjectId) {
        return FooModel.find({ userId }).lean();
    }

    async getById(id: string, userId: Types.ObjectId) {
        return FooModel.findOne({ _id: new Types.ObjectId(id), userId }).lean();
    }

    async update(id: string, userId: Types.ObjectId, data: { name?: string; status?: FooStatus }) {
        return FooModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id), userId },
            { $set: data },
            { new: true }
        ).lean();
    }

    async delete(id: string, userId: Types.ObjectId) {
        return FooModel.findOneAndDelete({ _id: new Types.ObjectId(id), userId }).lean();
    }
}

export const fooService = new FooService();
```

---

## 5. Router

- `createEndpoint.create({ use: [authMiddleware] })` — factory với auth baked-in, không cần khai báo `use` lặp lại.
- `ctx.context.userId` là `Types.ObjectId` từ JWT.
- Wrap mọi handler trong `RouterContainer` để tự catch lỗi.

```ts
// src/modules/foo/routes/foo.router.ts
import { createEndpoint } from "colyseus";
import { authMiddleware } from "@/modules/auth/middlewares/auth.middleware.js";
import { fooService } from "@/modules/foo/services/foo.service.js";
import {
    CreateFooSchema,
    UpdateFooSchema,
    FooIdSchema,
} from "@/modules/foo/validators/foo.validator.js";
import { Response, RouterContainer } from "@/utils/response.util.js";

const authEndpoint = createEndpoint.create({ use: [authMiddleware] });
const fooPrefix = "/foos";

export const fooRoutes = {
    create: authEndpoint(fooPrefix, { method: "POST", body: CreateFooSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const { userId } = ctx.context;
            const foo = await fooService.create(userId, ctx.body.name);
            return Response.created(ctx, { data: foo });
        })
    ),

    index: authEndpoint(fooPrefix, { method: "GET" }, (ctx) =>
        RouterContainer(ctx, async () => {
            return Response.ok({ data: await fooService.getAll(ctx.context.userId) });
        })
    ),

    show: authEndpoint(`${fooPrefix}/:id`, { method: "GET", params: FooIdSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const foo = await fooService.getById(ctx.params.id, ctx.context.userId);
            if (!foo) return Response.notFound(ctx, { message: "Not found" });
            return Response.ok({ data: foo });
        })
    ),

    update: authEndpoint(
        `${fooPrefix}/:id`,
        { method: "PUT", params: FooIdSchema, body: UpdateFooSchema },
        (ctx) =>
            RouterContainer(ctx, async () => {
                const foo = await fooService.update(ctx.params.id, ctx.context.userId, ctx.body);
                if (!foo) return Response.notFound(ctx, { message: "Not found" });
                return Response.ok({ data: foo });
            })
    ),

    delete: authEndpoint(`${fooPrefix}/:id`, { method: "DELETE", params: FooIdSchema }, (ctx) =>
        RouterContainer(ctx, async () => {
            const foo = await fooService.delete(ctx.params.id, ctx.context.userId);
            if (!foo) return Response.notFound(ctx, { message: "Not found" });
            return Response.ok({ message: "Deleted successfully" });
        })
    ),
};
```

---

## 6. Đăng ký vào `src/index.ts`

```ts
import { fooRoutes } from "@/modules/foo/routes/foo.router.js";

routes: createRouter({
    ...authRoutes,
    ...fooRoutes,  // thêm vào đây
}),
```

---

## Response helpers

| Helper                                  | HTTP | Dùng khi                |
| --------------------------------------- | ---- | ----------------------- |
| `Response.ok({ data })`                 | 200  | GET / UPDATE thành công |
| `Response.created(ctx, { data })`       | 201  | POST tạo mới            |
| `Response.notFound(ctx)`                | 404  | Không tìm thấy document |
| `Response.badRequest(ctx, { message })` | 400  | Input sai logic         |
| `Response.unauthorized(ctx)`            | 401  | Thiếu / sai token       |
| `Response.conflict(ctx)`                | 409  | Trùng dữ liệu           |
