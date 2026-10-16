// Badge colour for every role
export function roleTone(role) {
  return { user: 'stone', menejer: 'indigo', admin: 'amber', superAdmin: 'violet' }[role] ?? 'stone'
}
