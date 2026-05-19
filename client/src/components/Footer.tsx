/**
 * Site footer — brand, links, contact; supports dark mode.
 */
import { Building2 } from "lucide-react"
import { Link } from "react-router-dom"
import { footerData } from "@/assets/assets"

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Building2 className="size-6" />
              <span className="text-xl font-semibold">{footerData.brand.name}</span>
            </Link>
            <p className="text-sm text-white/60 mb-4 max-w-xs">
              Premium Kenyan house plans and digital blueprints for modern living.
            </p>
            <div className="flex gap-3">
              {footerData.brand.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="size-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerData.sections?.map((section, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-white/60 hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-white/60 hover:text-white">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
              Contact
            </h3>
            <ul className="space-y-3">
              {footerData.contact.map((item, i) => {
                const Icon = item.icon
                return (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <Icon className="size-4 shrink-0" />
                    {item.text}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {footerData.brand.name}. All rights reserved.</p>
          <div className="flex gap-4">
            {footerData.bottom.links.map((link, i) => (
              <a key={i} href={link.href} className="hover:text-white/70">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
