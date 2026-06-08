import { styles } from './Footer.styles';

const footerLinks = ['서비스 소개', '이용약관', '개인정보 처리방침', '운영 정책', '문의'];

export default function Footer() {
  return (
    <footer className = {styles.footer}>
      <div className = {styles.inner}>
        <nav className = {styles.links} aria-label = "푸터 메뉴">
          {footerLinks.map(label => (
            <button
              key = {label}
              type = "button"
              className = {styles.link}
            >
              {label}
            </button>
          ))}
        </nav>

        <p className = {styles.copyright}>© 2026 셔틀플레이. All rights reserved.</p>
      </div>
    </footer>
  );
}
