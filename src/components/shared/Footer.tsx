import Link from 'next/link'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='bg-background border-t'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='text-muted-foreground text-sm'>
            © {currentYear} Loan Wise. All rights reserved.
          </div>
          <div className='mt-4 flex space-x-4 md:mt-0'>
            <Link href='/privacy' className='text-muted-foreground hover:text-foreground text-sm'>
              Privacy Policy
            </Link>
            <Link href='/terms' className='text-muted-foreground hover:text-foreground text-sm'>
              Terms of Service
            </Link>
            <Link href='/contact' className='text-muted-foreground hover:text-foreground text-sm'>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
