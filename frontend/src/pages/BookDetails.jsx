import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Calendar, Check, Languages, Link2, UserRound } from 'lucide-react'
import { getBookById, getBooks } from '../services/bookService'
import { mediaUrl } from '../utils/media'
import { coverGradient } from '../utils/cover'
import { cn } from '../utils/cn'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

function Gallery({ book }) {
    const images = book.images ?? []
    const [index, setIndex] = useState(0)

    if (images.length === 0) {
        return (
            <div
                className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl"
                style={{ background: coverGradient(book.nomi) }}
            >
                <span className="font-display text-[10rem] leading-none font-bold text-white/20 select-none">
                    {book.nomi.charAt(0).toUpperCase()}
                </span>
            </div>
        )
    }

    return (
        <div>
            <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-stone-200 dark:bg-stone-800">
                <img
                    key={images[index]}
                    src={mediaUrl(images[index])}
                    alt={`${book.nomi} — ${index + 1}`}
                    className="size-full animate-fade-in object-cover"
                />
            </div>

            {images.length > 1 && (
                <div className="mt-3 flex gap-2">
                    {images.map((image, i) => (
                        <button
                            key={image}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`${i + 1}-rasm`}
                            className={cn(
                                'size-16 cursor-pointer overflow-hidden rounded-xl ring-2 transition',
                                i === index ? 'ring-amber-500' : 'opacity-70 ring-transparent hover:opacity-100'
                            )}
                        >
                            <img src={mediaUrl(image)} alt="" className="size-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function Spec({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
            <Icon className="size-5 shrink-0 text-amber-500" />
            <div className="min-w-0">
                <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
                <p className="truncate font-semibold text-stone-900 dark:text-stone-100">{value}</p>
            </div>
        </div>
    )
}

function Similar({ book }) {
    const { data } = useQuery({
        queryKey: ['books', 'similar', book.Janr],
        queryFn: () => getBooks({ search: book.Janr, limit: 5 }),
        enabled: Boolean(book.Janr),
    })

    const items = (data?.books ?? []).filter((item) => item._id !== book._id).slice(0, 4)
    if (items.length === 0) return null

    return (
        <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-100">O'xshash kitoblar</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                {items.map((item) => (
                    <Link
                        key={item._id}
                        to={`/books/${item._id}`}
                        className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
                    >
                        <div
                            className="aspect-[3/4] bg-cover bg-center"
                            style={
                                item.images?.[0]
                                    ? { backgroundImage: `url(${mediaUrl(item.images[0])})` }
                                    : { background: coverGradient(item.nomi) }
                            }
                        />
                        <div className="p-3">
                            <p className="truncate font-semibold text-stone-900 dark:text-stone-100">{item.nomi}</p>
                            <p className="truncate text-sm text-stone-500 dark:text-stone-400">{item.muallifi}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default function BookDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [copied, setCopied] = useState(false)

    const { data, isLoading, isError } = useQuery({
        queryKey: ['book', id],
        queryFn: () => getBookById(id),
        enabled: Boolean(id),
    })

    if (isLoading) return <p className="p-10">Kitob yuklanmoqda...</p>
    if (isError || !data) return <p className="p-10">Kitobni yuklashda xatolik yuz berdi.</p>

    const book = data.book ?? data
    const owner = book.user ? [book.user.ism, book.user.familiya].filter(Boolean).join(' ') : null

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
            <button
                type="button"
                onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/books'))}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            >
                <ArrowLeft className="size-4" /> Kitoblarga qaytish
            </button>

            <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
                <Gallery book={book} />

                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        {book.Janr && <Badge tone="indigo">{book.Janr}</Badge>}
                        <Badge tone={book.sotuvdaBor ? 'green' : 'red'}>
                            {book.sotuvdaBor ? 'Sotuvda bor' : "Sotuvda yo'q"}
                        </Badge>
                    </div>

                    <h1 className="mt-4 font-display text-4xl leading-tight font-bold text-stone-900 dark:text-stone-100">
                        {book.nomi}
                    </h1>
                    <p className="mt-2 text-lg text-stone-500 dark:text-stone-400">{book.muallifi}</p>

                    <p className="mt-6 text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {book.narxi != null ? `${Number(book.narxi).toLocaleString('uz-UZ')} so'm` : 'Narxi ko\'rsatilmagan'}
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Spec icon={BookOpen} label="Sahifalar soni" value={book.sahifasi ?? '—'} />
                        <Spec icon={Calendar} label="Nashr yili" value={book.nashrYili ?? '—'} />
                        <Spec icon={Languages} label="Tili" value={book.tili || '—'} />
                        <Spec icon={UserRound} label="Qo'shgan" value={owner || "Noma'lum"} />
                    </div>

                    <div className="mt-6">
                        <Button variant="secondary" icon={copied ? Check : Link2} onClick={copyLink}>
                            {copied ? 'Nusxalandi' : 'Havolani nusxalash'}
                        </Button>
                    </div>

                    {book.tavsif && (
                        <div className="mt-8 border-t border-stone-200 pt-6 dark:border-stone-800">
                            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Kitob haqida</h2>
                            <p className="mt-3 leading-7 whitespace-pre-line text-stone-600 dark:text-stone-300">{book.tavsif}</p>
                        </div>
                    )}
                </div>
            </div>

            <Similar book={book} />
        </main>
    )
}
