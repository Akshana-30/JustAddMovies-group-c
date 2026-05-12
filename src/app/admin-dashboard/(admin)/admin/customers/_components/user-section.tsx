import { formatDate } from "@/lib/utils";
import { users } from "../_actions/users";
import { StatusBadge } from "./status-badge";
import { formatPrice } from "@/lib/format";

export function UserSection({ title, people, count }: { title: string; people: typeof users; count: number }) {
    return (
        <div className="mb-10">
            <h2 className="font-display text-xl tracking-wide mb-4 text-[(--gold)]">
                {title.toUpperCase()} ({count})
            </h2>
            <div className="flex flex-col gap-3">
                {people.map((user) => (
                    <div key={user.id} className="rounded-xl border p-5 bg-[(--surface)] border-[(--border)]">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            {/* User info */}
                            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                                <div style={{
                                    width: "42px", height: "42px", borderRadius: "50%",
                                    background: "var(--surface3)", border: "2px solid var(--border-strong)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold)", flexShrink: 0,
                                }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>{user.name}</p>
                                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{user.email}</p>
                                    {/* {user.phone && (
                                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>📞 {user.phone}</p>
                                    )}
                                    {user.shippingAddress && (
                                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>📦 {user.shippingAddress}</p>
                                    )} */}
                                    <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "4px" }}>
                                        Member since {formatDate(user.createdAt)} · {user._count.orders} order{user._count.orders !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Recent orders */}
                            {user.orders.length > 0 && (
                                <div style={{ minWidth: "200px" }}>
                                    <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)", marginBottom: "6px" }}>
                                        Recent Orders
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        {user.orders.map((order) => (
                                            <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                                                <span style={{ color: "var(--text-dim)", fontFamily: "monospace", fontSize: "10px" }}>
                                                    #{order.id.slice(-6).toUpperCase()}
                                                </span>
                                                <StatusBadge status={order.status} />
                                                <span style={{ color: "var(--gold)", fontWeight: 500 }}>
                                                    {formatPrice(order.totalAmount)} kr
                                                </span>
                                                <span style={{ color: "var(--text-dim)" }}>
                                                    {formatDate(order.orderDate)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {people.length === 0 && (
                    <p style={{ color: "var(--text-dim)", fontStyle: "italic" }}>No {title.toLowerCase()} yet</p>
                )}
            </div>
        </div>
    );
}