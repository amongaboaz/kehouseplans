import { MailIcon } from "lucide-react"

const NewsLetter = () => {
  return (
    <section className="bg-white py-18 px-4 sm:px-6 lg:px-8 rounded-3xl mx-auto shadow-sm border border-gray-100 mt-24 mb-16">
        <div className="max-w-2xl mx-auto text-center">
            <div className="size-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <MailIcon className="size-8 text-blue-600" strokeWidth={1.5}/>
            </div>

            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Subscribe to our Newsletter
            </h2>
            <p className="text-gray-500 mb-8 text-base">Get updates on new architectural designs, special discounts, and home building tips directly to your inbox.</p>
            <form onSubmit={(e)=> e.preventDefault()}
             className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" 
              placeholder="Enter your email address" required
              className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white text-sm transition-all"
              />
              <button type="submit"
              className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
              >Subscribe</button>
            </form>
        </div>
    </section>
  )
}

export default NewsLetter
