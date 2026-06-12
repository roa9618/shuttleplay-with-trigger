import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ApiClientError } from '../utils/apiClient';
import type { FooterDocument, FooterDocumentKey } from '../utils/footerContent';
import { createInquiry, type InquiryCategory } from '../utils/inquiryApi';
import { styles } from './FooterModal.styles';

interface FooterModalProps {
  documentKey: FooterDocumentKey | null;
  document: FooterDocument | null;
  onClose: () => void;
}

type ContactForm = {
  category: InquiryCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
  agree: boolean;
};

type ContactStatus = {
  type: 'success' | 'error';
  message: string;
};

const defaultContactForm: ContactForm = {
  category: 'SERVICE_USAGE',
  name: '',
  email: '',
  subject: '',
  message: '',
  agree: false,
};

const contactCategories = [
  { value: 'SERVICE_USAGE', label: '서비스 이용 문의' },
  { value: 'ACCOUNT_LOGIN', label: '계정 및 로그인' },
  { value: 'GROUP_OPERATION', label: '모임 운영' },
  { value: 'MATCH_RECORD_MMR', label: '경기 기록 및 MMR' },
  { value: 'ERROR_REPORT', label: '오류 제보' },
  { value: 'PRIVACY_RIGHTS', label: '개인정보 권리 행사' },
  { value: 'REPORT_POLICY', label: '신고 및 운영 정책' },
  { value: 'OTHER', label: '기타 문의' },
] as const satisfies ReadonlyArray<{ value: InquiryCategory; label: string }>;

export default function FooterModal({ documentKey, document, onClose }: FooterModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [contactForm, setContactForm] = useState<ContactForm>(defaultContactForm);
  const [contactStatus, setContactStatus] = useState<ContactStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isContactDocument = documentKey === 'contact';

  useEffect(() => {
    if (!document) return;

    const previousOverflow = documentElementStyle();
    const previouslyFocused = window.document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [document, onClose]);

  useEffect(() => {
    if (!isContactDocument) {
      setContactForm(defaultContactForm);
      setContactStatus(null);
      setIsSubmitting(false);
    }
  }, [isContactDocument]);

  if (!document) return null;

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationMessage = validateContactForm(contactForm);
    if (validationMessage) {
      setContactStatus({ type: 'error', message: validationMessage });
      return;
    }

    setIsSubmitting(true);
    setContactStatus(null);

    try {
      window.localStorage.setItem('shuttleplay-contact-draft', JSON.stringify({
        ...contactForm,
        createdAt: new Date().toISOString(),
      }));
    } catch {
      // 로컬 저장이 막혀도 문의 작성 자체는 계속 진행합니다.
    }

    try {
      const response = await createInquiry({
        category: contactForm.category,
        name: contactForm.name.trim(),
        email: contactForm.email.trim(),
        subject: contactForm.subject.trim(),
        message: contactForm.message.trim(),
        privacyAgreed: contactForm.agree,
      });

      try {
        window.localStorage.removeItem('shuttleplay-contact-draft');
      } catch {
        // 문의 접수 성공 여부와 관계없는 로컬 임시 저장소 오류는 무시합니다.
      }
      setContactStatus({
        type: 'success',
        message: `문의가 접수되었습니다. 접수 번호는 ${response.id}번입니다.`,
      });
      setContactForm(defaultContactForm);
    } catch (error) {
      setContactStatus({
        type: 'error',
        message: error instanceof ApiClientError
          ? error.detail ?? error.message
          : '문의 접수 중 오류가 발생했습니다. 작성 내용은 이 기기에 임시 저장되었습니다.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className = {styles.overlay} onClick = {onClose}>
      <section
        className = {styles.modal}
        role = "dialog"
        aria-modal = "true"
        aria-labelledby = {titleId}
        onClick = {event => event.stopPropagation()}
      >
        <header className = {styles.header}>
          <div className = {styles.titleArea}>
            <h2 id = {titleId} className = {styles.title}>{document.title}</h2>
            <p className = {styles.summary}>{document.summary}</p>
            {document.effectiveDate && (
              <p className = {styles.effectiveDate}>시행일 {document.effectiveDate}</p>
            )}
          </div>
          <button ref = {closeButtonRef} type = "button" className = {styles.closeButton} onClick = {onClose} aria-label = "닫기">
            <X className = {styles.closeIcon} />
          </button>
        </header>

        <div className = {styles.body}>
          {document.sections.map(section => (
            <section key = {section.title} className = {styles.section}>
              <h3 className = {styles.sectionTitle}>{section.title}</h3>
              <div className = {styles.paragraphs}>
                {section.paragraphs.map(paragraph => (
                  <p key = {paragraph} className = {styles.paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {isContactDocument && (
            <section className = {styles.contactFormSection}>
              <h3 className = {styles.sectionTitle}>문의 작성</h3>
              <form className = {styles.contactForm} onSubmit = {handleContactSubmit}>
                <div className = {styles.formGrid}>
                  <label className = {styles.field}>
                    <span className = {styles.label}>문의 유형</span>
                    <select
                      className = {styles.select}
                      value = {contactForm.category}
                      onChange = {event => setContactForm(current => ({
                        ...current,
                        category: event.target.value as InquiryCategory,
                      }))}
                    >
                      {contactCategories.map(category => (
                        <option key = {category.value} value = {category.value}>{category.label}</option>
                      ))}
                    </select>
                  </label>

                  <label className = {styles.field}>
                    <span className = {styles.label}>이름</span>
                    <input
                      className = {styles.input}
                      value = {contactForm.name}
                      onChange = {event => setContactForm(current => ({ ...current, name: event.target.value }))}
                      placeholder = "답변받을 이름"
                      maxLength = {50}
                    />
                  </label>

                  <label className = {styles.field}>
                    <span className = {styles.label}>이메일</span>
                    <input
                      className = {styles.input}
                      type = "email"
                      value = {contactForm.email}
                      onChange = {event => setContactForm(current => ({ ...current, email: event.target.value }))}
                      placeholder = "reply@example.com"
                      maxLength = {100}
                    />
                  </label>

                  <label className = {styles.field}>
                    <span className = {styles.label}>제목</span>
                    <input
                      className = {styles.input}
                      value = {contactForm.subject}
                      onChange = {event => setContactForm(current => ({ ...current, subject: event.target.value }))}
                      placeholder = "문의 제목"
                      maxLength = {100}
                    />
                  </label>
                </div>

                <label className = {styles.messageField}>
                  <span className = {styles.label}>문의 내용</span>
                  <textarea
                    className = {styles.textarea}
                    value = {contactForm.message}
                    onChange = {event => setContactForm(current => ({ ...current, message: event.target.value }))}
                    placeholder = "발생한 화면, 상황, 원하는 처리 내용을 가능한 한 구체적으로 적어주세요."
                    rows = {7}
                    maxLength = {2000}
                  />
                </label>

                <label className = {styles.checkboxField}>
                  <input
                    className = {styles.checkbox}
                    type = "checkbox"
                    checked = {contactForm.agree}
                    onChange = {event => setContactForm(current => ({ ...current, agree: event.target.checked }))}
                  />
                  <span>
                    문의 처리에 필요한 범위에서 이름, 이메일, 문의 내용을 수집하고 확인하는 것에 동의합니다.
                  </span>
                </label>

                {contactStatus && (
                  <p className = {contactStatus.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {contactStatus.message}
                  </p>
                )}

                <div className = {styles.formActions}>
                  <button type = "submit" className = {styles.submitButton} disabled = {isSubmitting}>
                    {isSubmitting ? '문의 접수 중' : '문의 접수'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <footer className = {styles.footer}>
          <button type = "button" className = {styles.confirmButton} onClick = {onClose}>확인</button>
        </footer>
      </section>
    </div>,
    window.document.body,
  );
}

function documentElementStyle() {
  return window.document.body.style.overflow;
}

function validateContactForm(form: ContactForm) {
  if (!form.name.trim()) return '이름을 입력해 주세요.';
  if (!form.email.trim()) return '답변받을 이메일을 입력해 주세요.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return '이메일 형식을 확인해 주세요.';
  if (!form.subject.trim()) return '문의 제목을 입력해 주세요.';
  if (form.message.trim().length < 10) return '문의 내용은 10자 이상 입력해 주세요.';
  if (!form.agree) return '문의 처리를 위한 개인정보 수집·이용 동의가 필요합니다.';

  return '';
}
