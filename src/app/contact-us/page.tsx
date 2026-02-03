'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './page.module.scss'

interface ContactForm {
  type: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

const contactTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'business', label: 'Business Partnership' },
  { value: 'press', label: 'Press & Media' },
  { value: 'sponsorship', label: 'Sponsorship' },
]

export default function ContactUsPage() {
  const t = useTranslations()
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ContactForm>({
    type: 'general',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implementar envío del formulario con GraphQL
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setShowSuccess(true)
    setIsSubmitting(false)
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/+19547808630', '_blank')
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className="heading2">
            {showSuccess ? t('message_sent') : t('contact_us')}
          </h1>
          <p className="body1">
            {showSuccess
              ? t('thank_you_some_from_our_team_will_be_in_touch_soon')
              : t('no_question_is_too_big_or_too_small_select_your_question_type_and_add_a_message_and_well_be_happy_to_assist_you')}
          </p>
        </div>

        {!showSuccess && (
          <>
            <button className={styles.whatsappButton} onClick={openWhatsApp}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('speak_to_a_concierge')}
            </button>
            <p style={{ textAlign: 'center', color: 'var(--brand-mid-grey)' }}>
              +1 (954) 780-8630
            </p>

            <div className={styles.divider}>{t('or_fill_the_form_below')}</div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>{t('inquiry_type')}</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={styles.select}
                >
                  {contactTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('first_name')}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('enter_your_first_name')}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('last_name')}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('enter_your_last_name')}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('enter_your_email')}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t('phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={t('enter_your_phone')}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>{t('message')}</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder={t('write_your_message')}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('sending') : t('send_message')}
              </button>
            </form>
          </>
        )}

        {showSuccess && (
          <div className={styles.successMessage}>
            <h2 className="heading3">✓ {t('thank_you')}</h2>
            <p className="body1">{t('we_will_get_back_to_you_soon')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
