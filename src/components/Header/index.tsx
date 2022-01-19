import { useContext } from 'react'
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/auth'
import styles from './styles.module.scss'

export function Header() {
      const { user, signOut } = useContext(AuthContext)


      return (
            <>
                  <button onClick={signOut} className={styles.signOutButton}>
                        <VscSignOut size="32" />
                  </button>
                  <header className={styles.userInformation}>
                        <div className={styles.userImage}>
                              <img src={user?.avatar_url} alt={user?.name} />
                        </div>
                        <strong className={styles.userName}>{user?.name}</strong>
                        <span className={styles.userGithub}>
                              <VscGithubInverted size="16" />
                              {user?.login}
                        </span>


                  </header>
            </>
      )
}